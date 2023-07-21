local vals = redis.call("HMGET", KEYS[1], "Total", "Booked");
local total = tonumber(vals[1])
local booked = tonumber(vals[2])

if booked == 0 then
    redis.call("HINCRBY", KEYS[1], "Booked", 1)
    return 1
else
    return 0
end