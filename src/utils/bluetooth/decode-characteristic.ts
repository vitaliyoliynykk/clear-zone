export const decodeTextBTCharacteristic = async (
  characteristic: BluetoothRemoteGATTCharacteristic
) => {
  const rawValue = await characteristic.readValue();

  const decoder = new TextDecoder('utf-8');
  return decoder.decode(rawValue);
};
