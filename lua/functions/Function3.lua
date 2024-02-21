local function multipleReturn()
    return 1, true, "Hello Lua"
end

local a, b, c = multipleReturn();
print(a, b, c);