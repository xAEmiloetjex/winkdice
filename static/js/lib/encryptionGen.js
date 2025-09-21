import { _utils } from "./Utils.js";

export async function v2() {
  const blob = [];
  const data = await _utils.$types.void(
    [
      //"",
      0x000001,
      0x000002,
      0x000003,
      0x000004,
      0x000005,
      0x000006,
      0x000007,
      0x000008,
      0x000009,
      0x00000a,
      0x00000b,
      0x00000c,
      0x00000d,
      0x00000e,
      0x00000f,
      0x000000,
      0x000000,
      0x000000,
      //"",
      0x000001,
      0x000002,
      0x000003,
      0x000004,
      0x000005,
      0x000006,
      0x000007,
      0x000008,
      0x000009,
      0x00000a,
      0x00000b,
      0x00000c,
      0x00000d,
      0x00000e,
      0x00000f,
      0x000000,
      0x000000,
      0x000000,
      //"",
      0x000001,
      0x000002,
      0x000003,
      0x000004,
      0x000005,
      0x000006,
      0x000007,
      0x000008,
      0x000009,
      0x00000a,
      0x00000b,
      0x00000c,
      0x00000d,
      0x00000e,
      0x00000f,
      0x000000,
      0x000000,
      0x000000,
      //"",
      0x000001,
      0x000002,
      0x000003,
      0x000004,
      0x000005,
      0x000006,
      0x000007,
      0x000008,
      0x000009,
      0x00000a,
      0x00000b,
      0x00000c,
      0x00000d,
      0x00000e,
      0x00000f,
      0x000000,
      0x000000,
      0x000000,
      //"",
      0x000001,
      0x000002,
      0x000003,
      0x000004,
      0x000005,
      0x000006,
      0x000007,
      0x000008,
      0x000009,
      0x00000a,
      0x00000b,
      0x00000c,
      0x00000d,
      0x00000e,
      0x00000f,
      0x000000,
      0x000000,
      0x000000,
      //"",
      0x000001,
      0x000002,
      0x000003,
      0x000004,
      0x000005,
      0x000006,
      0x000007,
      0x000008,
      0x000009,
      0x00000a,
      0x00000b,
      0x00000c,
      0x00000d,
      0x00000e,
      0x00000f,
      0x000000,
      0x000000,
      0x000000,
      //"",
      0x000001,
      0x000002,
      0x000003,
      0x000004,
      0x000005,
      0x000006,
      0x000007,
      0x000008,
      0x000009,
      0x00000a,
      0x00000b,
      0x00000c,
      0x00000d,
      0x00000e,
      0x00000f,
      0x000000,
      0x000000,
      0x000000,
      //"",
      0x000001,
      0x000002,
      0x000003,
      0x000004,
      0x000005,
      0x000006,
      0x000007,
      0x000008,
      0x000009,
      0x00000a,
      0x00000b,
      0x00000c,
      0x00000d,
      0x00000e,
      0x00000f,
      0x000000,
      0x000000,
      0x000000,
      //"",
      0x000001,
      0x000002,
      0x000003,
      0x000004,
      0x000005,
      0x000006,
      0x000007,
      0x000008,
      0x000009,
      0x00000a,
      0x00000b,
      0x00000c,
      0x00000d,
      0x00000e,
      0x00000f,
      0x000000,
      0x000000,
      0x000000,
      //"",
      0x1a,
      0x1b,
      0x2a,
      0x2b,
      0x3a,
      0x3b,
      0x4a,
      0x4b,
      0x5a,
      0x5b,
      0x6a,
      0x6b,
      0x7a,
      0x7b,

      69420,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      _utils.$utils.randomNumber(4096),
    ],
    true
  );

  data.forEach((dat, ind) => blob.push(dat));
  let blob2 = 0;
  blob.forEach((data, index) => {
    return (blob2 = blob2 + data * (index == 0 ? 10 : index));
  });
  return `${_utils.$utils.makeid(6)}.${_utils.$utils.makeid(
    6
  )}.${_utils.$utils.makeid(6)}.${_utils.$utils.makeid(
    6
  )}.${_utils.$utils.makeid(6)}.${_utils.$utils.makeid(6)}.${blob2}`;
}

export async function v3() {
  const payload = [
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
  ];
  const endcapDecryptor = _utils.$utils.randomNumber(4096);

  let payload_ = [];

  payload.forEach((item) => {
    return payload_.push(Number(`0x${item}`));
  });

  let blob = [];
  const data = await _utils.$types.void(
    [endcapDecryptor, 0, 0, 0, 0, ...payload_],
    true
  );

  data.forEach((dat, ind) => blob.push(dat));
  let blob2 = 0;
  blob.forEach((data, index) => {
    return (blob2 = blob2 + data * (index == 0 ? 10 : index));
  });
  return {
    key: `${_utils.$utils.makeid(6)}.${_utils.$utils.makeid(
      6
    )}.${_utils.$utils.makeid(6)}.${_utils.$utils.makeid(
      6
    )}.${_utils.$utils.makeid(6)}.${_utils.$utils.makeid(6)}.${blob2}`,
    payload,
    endcap: blob2,
    endcapDecryptor,
  };
}

export async function v4(payloadExtender) {
  if (payloadExtender == undefined)
    payloadExtender = {
      key: "",
      payload: [],
      endcap: 0,
      endcapDecryptor: 0,
    };
  const payload = [
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
    _utils.$utils.hexcode(6),
  ];
  const endcapDecryptor = _utils.$utils.randomNumber(4096);

  let payload_ = [];

  payload.forEach((item) => {
    return payload_.push(Number(`0x${item}`));
  });

  let Extender = [];
  if (payloadExtender != undefined) {
    payloadExtender.payload.forEach((item) => {
      return Extender.push(
        Number(`0x${item}`) +
          payloadExtender.endcap / payloadExtender.endcapDecryptor
      );
    });
  }

  let blob = [];
  const data = await _utils.$types.void(
    [endcapDecryptor, 0, 0, 0, 0, ...Extender, ...payload_],
    true
  );

  data.forEach((dat, ind) => blob.push(dat));
  let blob2 = 0;
  blob.forEach((data, index) => {
    return (blob2 = blob2 + data * (index == 0 ? 10 : index));
  });
  return {
    key: `${_utils.$utils.makeid(6)}.${_utils.$utils.makeid(
      6
    )}.${_utils.$utils.makeid(6)}.${_utils.$utils.makeid(
      6
    )}.${_utils.$utils.makeid(6)}.${_utils.$utils.makeid(6)}.${blob2}`,
    payload,
    endcap: blob2,
    blob,
    endcapDecryptor,
  };
}

export async function merge(payloads) {
  let ebol = {
    key: "",
    payload: [],
    endcap: 0,
    endcapDecryptor: 0,
  };

  const endcapDecryptor = _utils.$utils.randomNumber(4096);

  payloads.forEach((data, index) =>
    data.payload.forEach((item) => ebol.payload.push(Number(`0x${item}`)))
  );
  let blob = [];
  const data = await _utils.$types.void(
    [endcapDecryptor, 0, 0, 0, 0, ...ebol.payload],
    true
  );

  data.forEach((dat, ind) => blob.push(dat));
  let blob2 = 0;
  blob.forEach((data, index) => {
    return (blob2 = blob2 + data * (index == 0 ? 10 : index) + endcapDecryptor);
  });
  return {
    key: `${_utils.$utils.makeid(6)}.${_utils.$utils.makeid(
      6
    )}.${_utils.$utils.makeid(6)}.${_utils.$utils.makeid(
      6
    )}.${_utils.$utils.makeid(6)}.${_utils.$utils.makeid(6)}.${blob2}`,
    payload: ebol.payload,
    blob,
    endcap: blob2,
    endcapDecryptor,
  };
}

export const gen = async () => {
  const salt = await v3();
  const gen1 = await v4(salt);
  const gen2 = await v4(salt);
  const gen3 = await v4(salt);
  console.log(`salt:`, salt);
  console.log(`gen1:`, gen1);
  console.log(`gen2:`, gen2);
  console.log(`gen3:`, gen3);

  const merged = await merge([gen1, gen2, gen3]);

  const genOmega = await v4(merged);

  console.log(`genOmega:`, genOmega);
  return genOmega;
};
