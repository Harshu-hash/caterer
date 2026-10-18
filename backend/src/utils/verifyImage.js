const SIGNATURES = [
  { bytes: [0xff, 0xd8, 0xff], name: 'jpeg' },
  { bytes: [0x89, 0x50, 0x4e, 0x47], name: 'png' },
  { bytes: [0x52, 0x49, 0x46, 0x46], name: 'webp' },
];

export function isValidImageBuffer(buffer) {
  return SIGNATURES.some((sig) => sig.bytes.every((byte, i) => buffer[i] === byte));
}
