print('Lutfen birinci sayi giriniz')
local inputNumber1 = io.read();
local number1 = tonumber(inputNumber1);

print('Lutfen ikinci sayiyi giriniz')
local inputNumber2 = io.read();
local number2 = tonumber(inputNumber2);

function max(n1, n2)
    local result;
    if n1 > n2 then
        result = n1;
    else 
        result = n2;
    end
    return result;
end

print('Buyuk sayi ==> ', max(number1, number2));



