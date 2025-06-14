import React, { useEffect, useState } from 'react';
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
} from 'flowbite-react';
import { CounterpartyFormData, CounterpartyFormErrors } from '../../../types';
import { isCounterpartyValid, validateForm } from './ModalFormValidator';
import { useCounterpartyContext } from '../../../context/CounterpartyContext';

/**
 * Modal component for creating and editing counterparties
 *
 * This component provides a form interface for creating new counterparties or editing existing ones.
 * It handles form validation, data submission, and error display.
 *
 * Features:
 * - Form validation for all fields (name, INN, address, KPP)
 * - Real-time validation feedback
 * - Support for both create and edit modes
 * - Error message display
 * - Color-coded input fields based on validation state
 *
 * @returns {JSX.Element} Modal component with form
 */
const CounterpartyModal = () => {
  const {
    isModalOpen: isOpen,
    handleSave: onSave,
    editingCounterparty: counterparty,
    setIsModalOpen,
  } = useCounterpartyContext();

  const onClose = () => {
    setIsModalOpen(false);
  };

  // Initial form state
  const initialFormData: CounterpartyFormData = {
    name: '',
    inn: '',
    address: '',
    kpp: '',
  };

  // Form state management
  const [formData, setFormData] = useState<CounterpartyFormData>({
    ...initialFormData,
    ...counterparty,
  });
  const [errors, setErrors] = useState<CounterpartyFormErrors>({});

  // Update form data when counterparty changes
  useEffect(() => {
    if (counterparty) {
      setFormData(counterparty);
      return;
    }
    setFormData(initialFormData);
  }, [counterparty]);

  /**
   * Handles form submission
   * Validates form data and calls onSave if valid
   *
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateForm(formData, setErrors);
    if (isCounterpartyValid(formData)) {
      onSave(formData);
    }
  };

  /**
   * Handles input field changes
   * Updates form data and validates the changed field
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const copy = { ...formData };
    if (name in formData) {
      copy[name as keyof CounterpartyFormData] = value;
    }
    validateForm(copy, setErrors);
    setFormData(copy);
  };

  /**
   * Determines the color of an input field based on its validation state
   *
   * @param {keyof CounterpartyFormErrors} fieldName - Name of the field to check
   * @returns {'failure' | 'success' | 'gray'} Color value for the input field
   */
  const colorCalculator = (fieldName: keyof CounterpartyFormErrors) => {
    return errors[fieldName] ? 'failure' : formData[fieldName] ? 'success' : 'gray';
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <ModalHeader>{counterparty ? 'Редактировать контрагента' : 'Новый контрагент'}</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name">Название</Label>
            </div>
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="МойСклад"
              title={'Name not empty'}
              minLength={1}
              color={colorCalculator('name')}
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* INN field */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="inn">ИНН</Label>
            </div>
            <TextInput
              id="inn"
              name="inn"
              value={formData.inn}
              onChange={handleChange}
              required
              color={colorCalculator('inn')}
              pattern="[0-9]{11}"
              title="ИНН должен состоять из 11 цифр"
              placeholder="12345678901"
              inputMode="numeric"
              maxLength={11}
              minLength={11}
            />
            {errors.inn && <p className="text-red-600 text-xs mt-1">{errors.inn}</p>}
          </div>

          {/* Address field */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="address">Адрес</Label>
            </div>
            <TextInput
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              color={colorCalculator('address')}
              placeholder="Москва, ул. Ленина, д. 1"
              minLength={1}
            />
            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* KPP field */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="kpp">КПП</Label>
            </div>
            <TextInput
              id="kpp"
              name="kpp"
              value={formData.kpp}
              onChange={handleChange}
              required
              color={colorCalculator('kpp')}
              pattern="[0-9]{9}"
              title="КПП должен состоять из 9 цифр"
              placeholder="123456789"
              inputMode="numeric"
              maxLength={9}
              minLength={9}
            />
            {errors.kpp && <p className="text-red-600 text-xs mt-1">{errors.kpp}</p>}
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="gray" onClick={() => onClose()}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} disabled={!isCounterpartyValid({ ...formData })}>
          Сохранить
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CounterpartyModal;
