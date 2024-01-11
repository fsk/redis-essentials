import { createClient } from "redis";

const client = createClient();

client.on('error', err => {
    console.log(`Redis Client Error ${err}`);
});

async function connectRedis() {
    try {
        await client.connect();
        console.log(`Connected to Redis`);
    } catch (err) {
        console.error(`Redis connection error: ${err}`);
    }
}

function LeaderBoard(key) {
    this.key = key;
}

LeaderBoard.prototype.addUser = async function(userName, score) {
    await client.zAdd(this.key, {score, value: userName});
    console.info(`User ${userName} added to the leaderboard with ${score} score`);
};

LeaderBoard.prototype.removeUser = async function(userName) {
    await client.zRem(this.key, userName);
    console.info(`User ${userName} removed successfully`);
};

LeaderBoard.prototype.getUserScoreAndRank = async function(userName) {
    const score = await client.zScore(this.key, userName);
    const rank = await client.zRevRank(this.key, userName);
    console.info(`Details of ${userName}: Score: ${score}, Rank: ${rank + 1}`);
};

LeaderBoard.prototype.showTopUsers = async function(quantity) {
    const min = 0; // Başlangıç indeksi
    const max = quantity - 1; // Bitiş indeksi
    const options = {
        BY: 'SCORE',
        REV: true,
        WITHSCORES: true
    };

    // zRange fonksiyonunu kullanarak kullanıcıları getir
    const users = await client.zRange(this.key, min, max, options);

    console.info(`Top ${quantity} users:`);
    for (let i = 0; i < users.length; i += 2) {
        console.info(`#${(i / 2) + 1} User: ${users[i]}, Score: ${users[i + 1]}`);
    }
};

LeaderBoard.prototype.getUsersAroundUser = async function(userName, range, callback) {
    try {
        const userRank = await client.zRevRank(this.key, userName);
        const start = Math.max(0, userRank - Math.floor(range / 2));
        const end = start + range - 1;

        const users = await client.zRange(this.key, start, end, { BY: 'SCORE', REV: true, WITHSCORES: true });
        let formattedUsers = [];
        for (let i = 0; i < users.length; i += 2) {
            formattedUsers.push({
                rank: start + (i / 2) + 1,
                username: users[i],
                score: users[i + 1]
            });
        }
        callback(formattedUsers);
    } catch (err) {
        console.error("An error occurred:", err);
    }
};

async function main() {
    await connectRedis();

    const leaderBoard = new LeaderBoard("game-score");

    await leaderBoard.addUser("Arthur", 70);
    await leaderBoard.addUser("KC", 20);
    await leaderBoard.addUser("Maxwell", 10);
    await leaderBoard.addUser("Patrik", 30);
    await leaderBoard.addUser("Ana", 60);
    await leaderBoard.addUser("Felipe", 40);
    await leaderBoard.addUser("Renata", 50);
    await leaderBoard.addUser("Hugo", 80);

    await leaderBoard.removeUser("Arthur");

    await leaderBoard.getUserScoreAndRank("Maxwell");

    await leaderBoard.showTopUsers(3);

    await leaderBoard.getUsersAroundUser("Felipe", 5, function (users) {
        console.log("\nUsers around Felipe:");
        users.forEach(function (user) {
            console.log(`#${user.rank} User: ${user.username}, Score: ${user.score}`);
        });
    });

    await client.quit();
}

main();
