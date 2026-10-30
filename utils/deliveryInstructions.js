// Oh-Delivery Feature 16: Delivery Instructions utilities

export const INSTRUCTION_TYPES = ['leave_at_door', 'ring_bell', 'call_on_arrival', 'meet_outside', 'custom'];

export function createInstruction(type, text) {
  if (!INSTRUCTION_TYPES.includes(type)) return null;
  if (type === 'custom' && (!text || text.trim().length === 0)) return null;
  return { type, text: text || getDefaultInstruction(type), createdAt: Date.now() };
}

export function getDefaultInstruction(type) {
  const defaults = {
    leave_at_door: 'Leave order at the door',
    ring_bell: 'Ring the doorbell',
    call_on_arrival: 'Call when arriving',
    meet_outside: 'Meet outside',
    custom: '',
  };
  return defaults[type] || '';
}

export function formatInstruction(instruction) {
  if (!instruction) return '';
  return instruction.text;
}

export function getInstructionIcon(type) {
  const icons = {
    leave_at_door: '🚪',
    ring_bell: '🔔',
    call_on_arrival: '📞',
    meet_outside: '🚶',
    custom: '📝',
  };
  return icons[type] || '📝';
}

export function validateInstruction(instruction) {
  if (!instruction) return { valid: false, error: 'Instruction required' };
  if (!INSTRUCTION_TYPES.includes(instruction.type)) return { valid: false, error: 'Invalid type' };
  if (instruction.type === 'custom' && (!instruction.text || instruction.text.trim().length === 0)) {
    return { valid: false, error: 'Custom instruction text required' };
  }
  return { valid: true };
}