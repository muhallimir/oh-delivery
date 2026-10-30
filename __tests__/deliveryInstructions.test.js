import { createInstruction, getDefaultInstruction, formatInstruction, getInstructionIcon, validateInstruction, INSTRUCTION_TYPES } from '../utils/deliveryInstructions';

describe('Delivery Instructions - Oh-Delivery Feature 16', () => {
  test('INSTRUCTION_TYPES includes types', () => {
    expect(INSTRUCTION_TYPES).toContain('leave_at_door');
    expect(INSTRUCTION_TYPES).toContain('custom');
  });

  test('createInstruction creates instruction', () => {
    const inst = createInstruction('leave_at_door');
    expect(inst).not.toBeNull();
    expect(inst.type).toBe('leave_at_door');
    expect(inst.text).toBe('Leave order at the door');
  });

  test('createInstruction creates custom', () => {
    const inst = createInstruction('custom', 'Ring twice');
    expect(inst.text).toBe('Ring twice');
  });

  test('createInstruction rejects invalid custom', () => {
    expect(createInstruction('custom', '')).toBeNull();
  });

  test('createInstruction rejects invalid type', () => {
    expect(createInstruction('invalid')).toBeNull();
  });

  test('getDefaultInstruction returns default', () => {
    expect(getDefaultInstruction('ring_bell')).toBe('Ring the doorbell');
  });

  test('formatInstruction formats', () => {
    const inst = createInstruction('leave_at_door');
    expect(formatInstruction(inst)).toBe('Leave order at the door');
  });

  test('getInstructionIcon returns icon', () => {
    expect(getInstructionIcon('leave_at_door')).toBe('🚪');
  });

  test('validateInstruction validates', () => {
    const inst = createInstruction('leave_at_door');
    expect(validateInstruction(inst).valid).toBe(true);
    expect(validateInstruction(null).valid).toBe(false);
  });
});