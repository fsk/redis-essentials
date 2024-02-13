function TimeSeries(client, namespace) {
    this.namespace = namespace;
    this.client = client;

    /**
     * Zaman Birimlerini saniye cinsinden içeren bir obje
     */
    this.units = {
        second: 1,
        minute: 60,
        hour: 60 * 60,
        day: 24 * 60 * 60
    };

    /**
     * granularity = Ayrıntı Düzeyi
     * duration: süre
     * ttl: Time to Live
     * 
     * 
     * Her bir granularity bir isme, bir TTL süresine bir de duration özelliği vardır.
     * Mesela '1sec' için;
     * -> name: '1sec'
     * -> ttl: 2 saat
     * -> süre: 1sn
     */

    this.granularities = {
        '1sec': { 
            name: '1sec',
            ttl: this.units.hour * 2,
            duration: this.units.second
        },
        '1min': {
            name: '1min',
            ttl: this.units.day * 7,
            duration: this.units.minute
        },
        '1hour': {
            name: '1hour',
            ttl: this.units.day * 7,
            duration: this.units.hour
        },
        '1day': {
            name: '1day',
            ttl: null,
            duration: this.units.day
        }
    }


}


TimeSeries.prototype.insert = async function(timestampInSeconds) {

    for(let granularityName in this.granularities) {
        let granularirty = this.granularities[granularityName];
        let key = this._getKeyName(granularirty, timestampInSeconds);
        await this.client.incr(key);
        if(granularirty.ttl !== null) {
            await this.client.expire(key, granularirty.ttl);
        }
    }

};


TimeSeries.prototype._getKeyName = function(granularirty, timestampInSeconds) {
    let roundedTimeStamp = this._getRoundedTimestamp(timestampInSeconds, granularirty.duration);
    return  [this.namespace, granularirty.name, roundedTimestamp].join(':');
};


TimeSeries.prototype._getRoundedTimestamp = function(timestampInSeconds, precision) {
    return Math.floor(timestampInSeconds / precision) * precision;
}

TimeSeries.prototype.fetch = async function(granularityName, beginTimestamp, endTimestamp) {
    let granularity = this.granularities[granularityName];
    let begin = this._getRoundedTimestamp(beginTimestamp, granularity.duration);
    let end = this._getRoundedTimestamp(endTimestamp, granularity.duration);
    let keys = [];
  
    for (let timestamp = begin; timestamp <= end; timestamp += granularity.duration) {
      let key = this._getKeyName(granularity, timestamp);
      keys.push(key);
    }
  
    try {
      const replies = await this._mgetAsync(keys);
      let results = [];
  
      for (let i = 0; i < replies.length; i++) {
        let timestamp = beginTimestamp + i * granularity.duration;
        let value = parseInt(replies[i], 10) || 0;
        results.push({ timestamp: timestamp, value: value });
      }
  
      return results;
    } catch (err) {
      console.error('Error during mget:', err);
      throw err; // Hata durumunda hatayı dışarı fırlat
    }
  };
  
  // _mgetAsync metodunu TimeSeries prototype'ına ekleyin
  TimeSeries.prototype._mgetAsync = function(keys) {
    return new Promise((resolve, reject) => {
      this.client.mget(keys, (err, replies) => {
        if (err) reject(err);
        else resolve(replies);
      });
    });
  };

  export { TimeSeries }