import React, { useState, useEffect, useMemo, useRef } from 'react';

interface ProgressBarProps {
    createdAt: number;
    dueDate: number;
    isCompleted: boolean;
    labelType?: 'remaining' | 'total';
    isEmpty?: boolean;
}

// A pleasant notification sound encoded in base64 to avoid an extra network request.
const alarmSound = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAASAAAAAENEUklDRV9TVEFSRUNPTkRFTgAAAA9kZWNvZGVkX2J5AFN0YXJ0dW5lAAAAAEdFTkVySQAAAAYxLjAuMgAAAABURVNTAAAAAAcAAAABA1RBU1QAAACgAAAAA//uAxAAAAAAAAAAAAAB22gB//uAxROAAAJihoDAAAAAP//uAxROBoAALCAoDAAAAAP//uAxROOwAALSAoDAAAAAP//uAxRIPAAALEgoDAAAAAP//uAxRIZgAALaAoDAAAAAP//uAxRIqAAALqAoDAAAAAP//uAxRLHgAAL2AoDAAAAAP//uAxRLYgAAMCAoDAAAAAP//uAxRMOAAAMKAoDAAAAAAP//uAxRMpAAANIAoDAAAAAP//uAxRNIAAANSAoDAAAAAP//uAxRNqgAANqAoDAAAAAP//uAxRONEAAN2AoDAAAAAAP//uAxROaAAAN6AoDAAAAAP//uAxRO4gAAOaAoDAAAAAAP//uAxRPEgAAOiAoDAAAAAP//uAxRPZgAAOqAoDAAAAAP//uAxRPogAAO6AoDAAAAAP//uAxRQGAAAPSAoDAAAAAP//uAxRQIQAAPWAoDAAAAAP//uAxRQYgAAPaAoDAAAAAP//uAxRQqAAAPyAoDAAAAAP//uAxRQuAAAP6AoDAAAAAP//uAxRQ9AAABCAoDAAAAAAP//uAxRRHgAABOAoDAAAAAAP//uAxRRTgAABSAoDAAAAAAP//uAxRRbAAABiAoDAAAAAAP//uAxRRtgAACCAoDAAAAAAP//uAxRR5AAACSAoDAAAAAAP//uAxRSBgAACaAoDAAAAAAP//uAxRSIAAACiAoDAAAAAP//uAxRSYAAAACqAoDAAAAAP//uAxRSqgAAACyAoDAAAAAAP//uAxRSyAAAAAC6AoDAAAAAP//uAxRS9gAAADCAoDAAAAAP//uAxRTGAAADSAoDAAAAAP//uAxRTIgAAADWAoDAAAAAAP//uAxTTZAAADeAoDAAAAAP//uAxRTqgAAADiAoDAAAAAP//uAxRTyAAAAADqAoDAAAAAP//uAxRUCAAAADuAoDAAAAAP//uAxRUXAAABCCoDAAAAAAP//uAxRUbAAABDSoDAAAAAAP//uAxRUdAAABFeAoDAAAAAAP//uAxRUlgAABHiAoDAAAAAAP//uAxRUrAAABLCoDAAAAAAP//uAxRUzQAABLioDAAAAAAP//uAxRU7gAABMOoDAAAAAAP//uAxRVHAAABNSoDAAAAAAP//uAxRVWAAABOCoDAAAAAAP//uAxRVegAABPSAoDAAAAAAP//uAxRVpAAABQCoDAAAAAAP//uAxRVwQAABQioDAAAAAAP//uAxRV3gAABQyoDAAAAAAP//uAxRWEAAABRYoDAAAAAAP//uAxRWNAAABRyoDAAAAAAP//uAxRWZAAABSCoDAAAAAAP//uAxRWfAAABSaoDAAAAAAP//uAxRWkAAABSooDAAAAAAP//uAxRWsAAABSyoDAAAAAAP//uAxRWzQAABS6oDAAAAAAP//uAxRXDAAABTCoDAAAAAAP//uAxRXHgAABTSoDAAAAAAP//uAxRXWQAABTioDAAAAAAP//uAxRXcAAABUSoDAAAAAAP//uAxRXgAAABUioDAAAAAAP//uAxRXkAAABUyoDAAAAAAP//uAxRXsAAABU6oDAAAAAAP//uAxRX0gAABVCYDAAAAAP//uAxRYBAAABVSoDAAAAAAP//uAxRYGgAABVSYDAAAAAAP//uAxRYMAAABVioDAAAAAAP//uAxRYTAAABWCoDAAAAAAP//uAxRYWAAABWSoDAAAAAAP//uAxRYdAAABWioDAAAAAAP//uAxRYiAAABWyoDAAAAAAP//uAxRYqAAABW6oDAAAAAAP//uAxRYyAAABXCoDAAAAAAP//uAxRY3AAABXSYDAAAAAP//uAxRY/AAABXioDAAAAAAP//uAxRZBAAABYCoDAAAAAAP//uAxRZGAAABYSoDAAAAAAP//uAxRZMgAABYyoDAAAAAAP//uAxRZaAAABY6oDAAAAAAP//uAxRZvAAABZCYDAAAAAAP//uAxRZ5AAABZSYDAAAAAAP//uAxRaCAAABZSYDAAAAAAP//uAxRaLAAABZioDAAAAAAP//uAxRaRAAABaCoDAAAAAAP//uAxRaVAAABaSoDAAAAAAP//uAxRadgAABaioDAAAAAAP//uAxRaiQAABayoDAAAAAAP//uAxRasgAABa6oDAAAAAAP//uAxRbBAAABbCoAADAAAAA//uAxRbIAAABbSoAADAAAAA//uAxRbcgAABbioAADAAAAA//uAxRb0QAABcSoAADAAAAA//uAxRcCAAABcioAADAAAAA//uAxRcSAAAFcypAADAAAAA//uAxRcYAAABc6oAADAAAAA//uAxRcgAAABdCYAADAAAAA//uAxRcoAAABdSoAADAAAAA//uAxRc2gAABdSYAADAAAAA//uAxRdAgAABdioAADAAAAA//uAxRdGAAABeCoAADAAAAA//uAxRdRgAABeSoAADAAAAA//uAxRdeAAABeioAADAAAAA//uAxRdmgAABeyoAADAAAAA//uAxRdxAAABe6oAADAAAAA//uAxReDAAABfCoAADAAAAA//uAxReQAAABfSoAADAAAAA//uAxRedAAABfioAADAAAAA//uAxRe3AAABgSoAADAAAAA//uAxRfAgAABgioAADAAAAA//uAxRfRQAABgyoAADAAAAA//uAxRfZgAABg6oAADAAAAA//uAxRfiAAABhCYAADAAAAA//uAxRfsAAABhSoAADAAAAA//uAxRgCAAABhSYAADAAAAA//uAxRgVAAABhioAADAAAAA//uAxRgaQAABiCoAADAAAAA//uAxRglAAABiSoAADAAAAA//uAxRgqAAABiioAADAAAAA//uAxRgyQAABiyoAADAAAAA//uAxRg5AAABi6oAADAAAAA//uAxRhDAAABjCoAADAAAAA//uAxRhSAAAAGNSoAADAAAAA//uAxRhcgAABjioAADAAAAA//uAxRh0gAAABkSoAADAAAAA//uAxRiBAAABkioAADAAAAA//uAxRiOAAABkyoAADAAAAA//uAxRiWAAABk6oAADAAAAA//uAxRicAAABlCYAADAAAAA//uAxRioAAABlSoAADAAAAA//uAxRizgAABlSYAADAAAAA//uAxRjAgAABlioAADAAAAA//uAxRjLAAABmCoAADAAAAA//uAxRjUAAABmSoAADAAAAA//uAxRjZAAABmioAADAAAAA//uAxRjjgAABmyoAADAAAAA//uAxRjwQAABm6oAADAAAAA//uAxRkDAAABnCoAADAAAAA//uAxRkQQAABnSoAADAAAAA//uAxRkaQAABnioAADAAAAA//uAxRkoQAABoSoAADAAAAA//uAxRkzgAABoioAADAAAAA//uAxRlAwAABoyoAADAAAAA//uAxRlOQAABo6oAADAAAAA//uAxRlZAAABpCYAADAAAAA//uAxRllwAABpSoAADAAAAA//uAxRlwQAABpSYAADAAAAA//uAxRmBQAABpioAADAAAAA//uAxRmOAAABqCoAADAAAAA//uAxRmYgAABqSoAADAAAAA//uAxRmmAAABqioAADAAAAA//uAxRmxgAABqyoAADAAAAA//uAxRnAwAABq6oAADAAAAA//uAxRnLAAABrCoAADAAAAA//uAxRnVAAABrSoAADAAAAA//uAxRnfgAABrioAADAAAAA//uAxRnoAAABsSoAADAAAAA//uAxRn3gAABsioAADAAAAA//uAxRoGQAABsyoAADAAAAA//uAxRoWAAABs6oAADAAAAA//uAxRofgAABtCYAADAAAAA//uAxRorAAABtSoAADAAAAA//uAxRo4gAABtSYAADAAAAA//uAxRpCAAABtioAADAAAAA//uAxRpQQAABuCoAADAAAAA//uAxRpZAAABuSoAADAAAAA//uAxRpogAABuioAADAAAAA//uAxRp1gAABuyoAADAAAAA//uAxRqBgAABu6oAADAAAAA//uAxRqQQAABvCoAADAAAAA//uAxRqcAAABvSoAADAAAAA//uAxRqzAAABvioAADAAAAA//uAxRrBAAABwSoAADAAAAA//uAxRrQQAABwioAADAAAAA//uAxRrbAAABwyoAADAAAAA//uAxRrxwAABw6oAADAAAAA//uAxRsDwAABxCYAADAAAAA//uAxRsXgAABxSoAADAAAAA//uAxRsnAAABxSYAADAAAAA//uAxRs9wAABxioAADAAAAA//uAxRtEAAABzCoAADAAAAA//uAxRtWAAABzSoAADAAAAA//uAxRtigAABzioAADAAAAA//uAxRtvwAAB0SoAADAAAAA//uAxRuBwAAB0ioAADAAAAA//uAxRuSAAAB0yoAADAAAAA//uAxRubgAAB06oAADAAAAA//uAxRu2gAAB1CYAADAAAAA//uAxRvEAAAB1SoAADAAAAA//uAxRvYgAAB1SYAADAAAAA//uAxRvqAAAB1ioAADAAAAA//uAxRwAAAAB2CoAADAAAAA//uAxRwPAAAB2SoAADAAAAA//uAxRwaQAAB2ioAADAAAAA//uAxRwvgAAB2yoAADAAAAA//uAxRxAAAAB26oAADAAAAA//uAxRxMQAAAHeCoAADAAAAA//uAxRxZQAAB3SoAADAAAAA//uAxRxpQAAB3ioAADAAAAA//uAxRx5AAAB4SoAADAAAAA//uAxRyHwAAB4ioAADAAAAA//uAxRyWAAAB4yoAADAAAAA//uAxRylQAAB46oAADAAAAA//uAxRy/gAAB5CYAADAAAAA//uAxRzMgAAB5SoAADAAAAA//uAxRzfAAAB5SYAADAAAAA//uAxRzzwAAB5ioAADAAAAA//uAxR0LgAAB6CoAADAAAAA//uAxR0bAAAB6SoAADAAAAA//uAxR0sgAAB6ioAADAAAAA//uAxR1AAAAAB6yoAADAAAAA//uAxR1LQAAB66oAADAAAAA//uAxR1eAAAB7CoAADAAAAA//uAxR1zQAAB7SoAADAAAAA//uAxR2HwAAB7ioAADAAAAA//uAxR2ZgAAB8SoAADAAAAA//uAxR2rAAAB8ioAADAAAAA//uAxR3AAAAB8yoAADAAAAA//uAxR3PwAAB86oAADAAAAA//uAxR3gQAAB9CYAADAAAAA//uAxR3zQAAB9SoAADAAAAA//uAxR4KwAAB9SYAADAAAAA//uAxR4ZgAAB9ioAADAAAAA//uAxR4vgAAB+CoAADAAAAA//uAxR5DgAAB+SoAADAAAAA//uAxR5ewAAB+ioAADAAAAA//uAxR54AAAB+yoAADAAAAA//uAxR6JgAAB+6oAADAAAAA//uAxR6iAAAB/CoAADAAAAA//uAxR7BAAAB/SoAADAAAAA//uAxR7VwAAB/ioAADAAAAA//uAxR7sQAAAAASoAADAAAAA//uAxR8BgAAAAAioAADAAAAA//uAxR8WwAAAACyoAADAAAAA//uAxR8pAAAAAC6oAADAAAAA//uAxR9AQAACAQYAADAAAAA//uAxR9SQAAACEYAADAAAAA//uAxR9gQAAACIoAADAAAAA//uAxR9uAAAAACQgAADAAAAA//uAxR+EAAAAACUAADAAAAA//uAxR+XAAAAACYAADAAAAA//uAxR+oAAAAACcAADAAAAA//uAxR/AAAAAAnoAADAAAAA//uAxR/QAAAACgAADAwAAAP//uAxSAEQAACgoAADAwAAAP//uAxSAHQAACgwAADAwAAAP//uAxSAKQAACg4AADAwAAAP//uAxSANwAACg8AADAwAAAP//uAxSARAAACg8AADAwAAAP//uAxSAUQAACg4AADAwAAAP//uAxSAYwAACgwAADAwAAAP//uAxSAcgAACgoAADAwAAAP//uAxSAmgAACdAAADAwAAAP//uAxSAvwAACdEAADAwAAAP//uAxSAxAAACdIAADAwAAAP//uAxSAzAAACdMAADAwAAAP//uAxSA5gAACdQAADAwAAAP//uAxSA8AAACdYAADAwAAAP//uAxSBAAAACdcAADAwAAAP//uAxSBDAAACdYAADAwAAAP//uAxSBFQAACdQAADAwAAAP//uAxSBJwAACdMAADAwAAAP//uAxSBMwAACdIAADAwAAAP//uAxSBRgAACdEAADAwAAAP//uAxSBTAAACdAAADAwAAAP//uAxSBYgAACcoAADAwAAAP//uAxSBaAAACckAADAwAAAP//uAxSBdQAACcgAADAwAAAP//uAxSBfgAACcYAADAwAAAP//uAxSBjAAACcUAADAwAAAP//uAxSBmwAACcMAADAwAAAP//uAxSBqgAACcIAADAwAAAP//uAxSBtQAACcAAADAwAAAP//uAxSBwQAACb4AADAwAAAP//uAxSBzAAACb0AADAwAAAP//uAxSB1wAACbsAADAwAAAP//uAxSB4gAACboAADAwAAAP//uAxSB8AAACbgAADAwAAAP//uAxSCBAAACbYAADAwAAAP//uAxSCFgAACbQAADAwAAAP//uAxSCJAAACbIAADAwAAAP//uAxSCMAAACbEAADAwAAAP//uAxSCQAAACbAAADAwAAAP//uAxSCVwAACasAADAwAAAP//uAxSCYwAACaoAADAwAAAP//uAxSCcAAACagAADAwAAAP//uAxSCggAACaYAADAwAAAP//uAxSCkAAACaQAADAwAAAP//uAxSCnQAACaIAADAwAAAP//uAxSCqQAACaEAADAwAAAP//uAxSCsAAACaAAADAwAAAP//uAxSCvAAACZ8AADAwAAAP//uAxSCyQAACZ4AADAwAAAP//uAxSC0AAACZ0AADAwAAAP//uAxSC3AAACZwAADAwAAAP//uAxSC5AAACZsAADAwAAAP//uAxSC7QAACZgAADAwAAAP//uAxSC+AAACZUAADAwAAAP//uAxSDAAAACZMAADAwAAAP//uAxSDFgAACZAAADAwAAAP//uAxSDGAAACZAAADAwAAAP//uAxSDJAAACZEAADAwAAAP//uAxSDLwAACZIAADAwAAAP//uAxSDOgAACZMAADAwAAAP//uAxSDSwAACZQAADAwAAAP//uAxSDUAAACZYAADAwAAAP//uAxSDYgAACZgAADAwAAAP//uAxSDbQAACZsAADAwAAAP//uAxSDegAACZwAADAwAAAP//uAxSDggAACZ0AADAwAAAP//uAxSDjAAACZ4AADAwAAAP//uAxSDlQAACZ8AADAwAAAP//uAxSDpAAACaAAADAwAAAP//uAxSDtAAACaEAADAwAAAP//uAxSDwgAACaIAADAwAAAP//uAxSDzgAACaQAADAwAAAP//uAxSECAAACaYAADAwAAAP//uAxSEFAAACYAAADAwAAAP//uAxSEJAAACYEAADAwAAAP//uAxSEQAAACYIAADAwAAAP//uAxSEVwAACYMAADAwAAAP//uAxSEYQAACYQAADAwAAAP//uAxSEcAAACYUAADAwAAAP//uAxSEgAAACYAAADAwAAAP//uAxSEmAAACX8AADAwAAAP//uAxSEqAAACX4AADAwAAAP//uAxSEtAAACX0AADAwAAAP//uAxSEwgAACXwAADAwAAAP//uAxSEzQAACXsAADAwAAAP//uAxSE1wAACXoAADAwAAAP//uAxSE4AAACXgAADAwAAAP//uAxSE6gAACXYAADAwAAAP//uAxSE9QAACXQAADAwAAAP//uAxSFAAAACXIAADAwAAAP//uAxSFDgAACXEAADAwAAAP//uAxSFHAAACXAAADAwAAAP//uAxSFKQAACWwAADAwAAAP//uAxSFNAAACWoAADAwAAAP//uAxSFRgAACWgAADAwAAAP//uAxSFWgAACWYAADAwAAAP//uAxSFZwAACWQAADAwAAAP//uAxSFcwAACWIAADAwAAAP//uAxSFfgAACWEAADAwAAAP//uAxSFhQAACWAAADAwAAAP//uAxSFkAAACV8AADAwAAAP//uAxSFnQAACV4AADAwAAAP//uAxSFqgAACV0AADAwAAAP//uAxSFtgAACVwAADAwAAAP//uAxSFwAAACVsAADAwAAAP//uAxSFyQAACVgAADAwAAAP//uAxSF0wAACVUAADAwAAAP//uAxSF3gAACVMAADAwAAAP//uAxSF5wAACVAAADAwAAAP//uAxSF8QAACU8AADAwAAAP//uAxSF+gAACU4AADAwAAAP//uAxSGAQAACU0AADAwAAAP//uAxSGFgAACUwgAADAwAAAP//uAxSGIQAACUoAADAwAAAP//uAxSGLQAACUgAADAwAAAP//uAxSGOQAACUQAADAwAAAP//uAxSGRgAACUAAADAwAAAP//uAxSGUAAACUsAADAwAAAP//uAxSGWQAACUsAADAwAAAP//uAxSGZAAACUsAADAwAAAP//uAxSGbwAACUsAADAwAAAP//uAxSGeAAACUsAADAwAAAP//uAxSGiAAACUsAADAwAAAP//uAxSGkwAACUYAADAwAAAP//uAxSGngAACUYAADAwAAAP//uAxSGrAAACUYAADAwAAAP//uAxSGtQAACUYAADAwAAAP//uAxSGuAAACUYAADAwAAAP//uAxSGwgAACUYAADAwAAAP//uAxSGywAACUYAADAwAAAP//uAxSGzwAACUAAADAwAAAP//uAxSHDgAACUQAADAwAAAP//uAxSHGwAACUgAADAwAAAP//uAxSHKQAACUoAADAwAAAP//uAxSHNAAACUwgAADAwAAAP//uAxSHSAAACU0AADAwAAAP//uAxSHWQAACU4AADAwAAAP//uAxSHaAAACU8AADAwAAAP//uAxSHdgAACVAAADAwAAAP//uAxSHggAACVMAADAwAAAP//uAxSHkQAACVUAADAwAAAP//uAxSHmQAACVgAADAwAAAP//uAxSHqQAACVsAADAwAAAP//uAxSHtAAACVwAADAwAAAP//uAxSHwAAACV0AADAwAAAP//uAxSHyAAACV4AADAwAAAP//uAxSH0QAACV8AADAwAAAP//uAxSH3gAACWAAADAwAAAP//uAxSH6AAACWEAADAwAAAP//uAxSH8wAACWIAADAwAAAP//uAxSIAgAACWQAADAwAAAP//uAxSIEAAACWYAADAwAAAP//uAxSIGwAACWgAADAwAAAP//uAxSIJQAACWoAADAwAAAP//uAxSIMAAACWwAADAwAAAP//uAxSIPQAACXAAADAwAAAP//uAxSISgAACXEAADAwAAAP//uAxSIUQAACXIAADAwAAAP//uAxSIWQAACXQAADAwAAAP//uAxSIZQAACXYAADAwAAAP//uAxSIcgAACXgAADAwAAAP//uAxSIgAAACXoAADAwAAAP//uAxSIkQAACXsAADAwAAAP//uAxSInAAACXwAADAwAAAP//uAxSIqgAACX0AADAwAAAP//uAxSIswAACX4AADAwAAAP//uAxSIvQAACX8AADAwAAAP//uAxSIxQAACYAAADAwAAAP//uAxSIzAAACYUAADAwAAAP//uAxSI5AAACYQAADAwAAAP//uAxSI7AAACYMAADAwAAAP//uAxSI+AAACYIAADAwAAAP//uAxSJAQAACYEAADAwAAAP//uAxSJFAAACYAAADAwAAAP//uAxSJIQAACaYAADAwAAAP//uAxSJLAAACaQAADAwAAAP//uAxSJOQAACaIAADAwAAAP//uAxSJRQAACaEAADAwAAAP//uAxSJTgAACaAAADAwAAAP//uAxSJVQAACZ8AADAwAAAP//uAxSJWwAACZ4AADAwAAAP//uAxSJZgAACZ0AADAwAAAP//uAxSJcAAACZwAADAwAAAP//uAxSJfQAACZsAADAwAAAP//uAxSJiAAACZgAADAwAAAP//uAxSJkQAACZUAADAwAAAP//uAxSJnAAACZMAADAwAAAP//uAxSJoAAACZAAADAwAAAP//uAxSJqAAACZAAADAwAAAP//uAxSJsAAACZEAADAwAAAP//uAxSJugAACZIAADAwAAAP//uAxSJwgAACZMAADAwAAAP//uAxSJyAAACZQAADAwAAAP//uAxSJzQAACZYAADAwAAAP//uAxSJ2QAACZgAADAwAAAP//uAxSJ4AAACZsAADAwAAAP//uAxSJ6gAACZwAADAwAAAP//uAxSJ9gAACZ0AADAwAAAP//uAxSKAAAACZ4AADAwAAAP//uAxSKCAAACZ8AADAwAAAP//uAxSKFAAACYAAADAwAAAP//uAxSKIgAACaEAADAwAAAP//uAxSKLAAACaIAADAwAAAP//uAxSKOgAACaQAADAwAAAP//uAxSKRAAACaYAADAwAAAP//uAxSKTAAACagAADAwAAAP//uAxSKVAAACaoAADAwAAAP//uAxSKXgAACasAADAwAAAP//uAxSKaAAACbAAADAwAAAP//uAxSKdQAACbEAADAwAAAP//uAxSKgQAACbIAADAwAAAP//uAxSKjAAACbQAADAwAAAP//uAxSKmAAACbYAADAwAAAP//uAxSKpgAACbgAADAwAAAP//uAxSKsAAACboAADAwAAAP//uAxSKugAACbsAADAwAAAP//uAxSKxQAACb0AADAwAAAP//uAxSKzAAACb4AADAwAAAP//uAxSK5AAACcAAADAwAAAP//uAxSK7AAACcIAADAwAAAP//uAxSK+AAACcMAADAwAAAP//uAxSLAAAACcUAADAwAAAP//uAxSLCAAACcYAADAwAAAP//uAxSLFAAACYgAADAwAAAP//uAxSLIAAACckAADAwAAAP//uAxSLLAAACcoAADAwAAAP//uAxSLOQAAACdAAADAwAAAP//uAxSLRAAACdEAADAwAAAP//uAxSLTAAACdIAADAwAAAP//uAxSLVAAACdMAADAwAAAP//uAxSLXgAACdQAADAwAAAP//uAxSLaAAACdYAADAwAAAP//uAxSLdQAACdcAADAwAAAP//uAxSLgQAACdYAADAwAAAP//uAxSLjAAACdQAADAwAAAP//uAxSLmAAACdMAADAwAAAP//uAxSLpgAACdIAADAwAAAP//uAxSLsAAACdEAADAwAAAP//uAxSLugAACdAAADAwAAAP//uAxSLxQAACcoAADAwAAAP//uAxSLzAAACgwAADAwAAAP//uAxSL5AAACg4AADAwAAAP//uAxSL7AAACg8AADAwAAAP//uAxSL+AAACg8AADAwAAAP//uAxSMAQAACg4AADAwAAAP//uAxSMFAAACgwAADAwAAAP//uAxSMIQAACgoAADAwAAAP//uAxSMLAAACcAAADAwAAAP//uAxSMOQAAACbgAADAwAAAP//uAxSMRQAAACboAADAwAAAP//uAxSMTgAAACbsAADAwAAAP//uAxSMVQAAACb0AADAwAAAP//uAxSMXgAACb4AADAwAAAP//uAxSMaAAACcAAADAwAAAP//uAxSMdQAACcIAADAwAAAP//uAxSMgQAACcMAADAwAAAP//uAxSMjAAACcUAADAwAAAP//uAxSMmAAACcYAADAwAAAP//uAxSMpgAACcgAADAwAAAP//uAxSMsAAACckAADAwAAAP//uAxSMugAACcoAADAwAAAP//uAxSMxQAAAAA';
const audio = new Audio(alarmSound);

const formatTimeRemaining = (ms: number): string => {
    if (ms <= 0) return "انتهى الوقت";

    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    const parts = [];
    if (days > 0) parts.push(`${days} يوم`);
    if (hours > 0) parts.push(`${hours} ساعة`);
    if (minutes > 0) parts.push(`${minutes} دقيقة`);
    if (seconds > 0 && days === 0) parts.push(`${seconds} ثانية`);
    
    return parts.length > 0 ? `متبقي: ${parts.join(' ')}` : "أقل من ثانية";
};

const formatTotalDuration = (ms: number): string => {
    if (ms <= 0) return "بدون مدة";

    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    const parts = [];
    if (days > 0) parts.push(`${days} يوم`);
    if (hours > 0) parts.push(`${hours} ساعة`);
    if (minutes > 0) parts.push(`${minutes} دقيقة`);
    if (seconds > 0 && days === 0 && hours === 0) parts.push(`${seconds} ثانية`);
    
    return parts.length > 0 ? `إجمالي الوقت: ${parts.join(' ')}` : "بدون مدة";
};


const ProgressBar: React.FC<ProgressBarProps> = ({ createdAt, dueDate, isCompleted, labelType = 'remaining', isEmpty = false }) => {
    const [now, setNow] = useState(Date.now());
    const playedSound = useRef(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Effect to detect the first user interaction to allow audio playback.
    useEffect(() => {
        const onInteraction = () => setHasInteracted(true);
        window.addEventListener('click', onInteraction, { once: true });
        window.addEventListener('keydown', onInteraction, { once: true });
        return () => {
            window.removeEventListener('click', onInteraction);
            window.removeEventListener('keydown', onInteraction);
        };
    }, []);

    useEffect(() => {
        let animationFrameId: number;
        const update = () => {
            setNow(Date.now());
            animationFrameId = requestAnimationFrame(update);
        };
        animationFrameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const { percentage, remainingTime, isOverdue } = useMemo(() => {
        if (isEmpty) {
            return { percentage: 0, remainingTime: 0, isOverdue: false };
        }
        const totalDuration = dueDate - createdAt;
        const elapsedTime = now - createdAt;
        const remaining = dueDate - now;

        let perc = 0;
        if (totalDuration > 0) {
            perc = Math.min(100, (elapsedTime / totalDuration) * 100);
        } else if (now >= dueDate) {
            perc = 100;
        }

        return {
            percentage: isCompleted ? 100 : perc,
            remainingTime: remaining,
            isOverdue: now > dueDate && !isCompleted && labelType === 'remaining' // Only trigger alarm for sub-tasks
        };
    }, [now, createdAt, dueDate, isCompleted, isEmpty, labelType]);

    useEffect(() => {
        if (isOverdue && !playedSound.current && hasInteracted) {
            audio.play().catch(e => console.error("Error playing sound. User interaction might be required.", e));
            playedSound.current = true;
        }
        // Reset if task is no longer overdue (e.g., completed, or date changed)
        if (!isOverdue && playedSound.current) {
            playedSound.current = false;
        }
    }, [isOverdue, hasInteracted]);

    const barColor = useMemo(() => {
        if (isCompleted) return 'var(--success-color)';
        if (isOverdue) return 'var(--danger-color)';
        if (!isEmpty && percentage > 80) return 'var(--warning-color)';
        return 'var(--primary-color)';
    }, [isCompleted, isOverdue, percentage, isEmpty]);
    
    const labelText = useMemo(() => {
        if (isCompleted) return "مكتمل";
        if (isEmpty) return "بدون مدة";
        if (labelType === 'total') {
            return formatTotalDuration(dueDate - createdAt);
        }
        return formatTimeRemaining(remainingTime);
    }, [isCompleted, isEmpty, labelType, createdAt, dueDate, remainingTime]);

    const containerStyle: React.CSSProperties = {
        width: '100%',
        backgroundColor: 'var(--bg-color)',
        borderRadius: '8px',
        overflow: 'hidden',
        height: '24px',
        position: 'relative',
        border: `1px solid ${barColor}`,
        marginTop: '8px',
    };

    const fillerStyle: React.CSSProperties = {
        height: '100%',
        width: `${percentage}%`,
        backgroundColor: barColor,
        borderRadius: '8px 0 0 8px',
        transition: 'width 0.2s ease-in-out, background-color 0.2s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const labelStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
    };
    
    return (
        <div style={containerStyle}>
            <div style={fillerStyle}></div>
            <span style={labelStyle}>{labelText}</span>
        </div>
    );
};

export default ProgressBar;