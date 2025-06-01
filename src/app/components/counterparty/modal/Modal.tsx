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
import { Counterparty, CounterpartyFormData } from '../../../types';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CounterpartyFormData) => void;
  counterparty?: Counterparty;
};

const validateInn = (inn?: string) => {
  if (!inn) {
    return false;
  }
  return /^\d{11}$/.test(inn);
};

const validateKpp = (kpp?: string) => {
  if (!kpp) {
    return false;
  }
  return /^\d{9}$/.test(kpp);
};

const validateAddress = (address?: string) => {
  if (!address) {
    return false;
  }
  return address.length > 0;
};

const validateName = (name?: string) => {
  if (!name) {
    return false;
  }
  return name.length > 0;
};

const isValidConteParty = (counterparty: CounterpartyFormData) => {
  return (
    validateInn(counterparty.inn) &&
    validateKpp(counterparty.kpp) &&
    validateAddress(counterparty.address) &&
    validateName(counterparty.name)
  );
};

const CounterpartyModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, counterparty }) => {
  const [formData, setFormData] = useState<CounterpartyFormData>({
    name: '',
    inn: '',
    address: '',
    kpp: '',
    ...counterparty,
  });

  type FormErrors = {
    inn?: string;
    kpp?: string;
    name?: string;
    address?: string;
  };

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (counterparty) {
      setFormData(counterparty);
    }
  }, [counterparty]);

  function validateForm(counterparty: CounterpartyFormData) {
    const newErrors: FormErrors = {};
    if (!validateName(counterparty.name)) {
      newErrors.name = 'Название не может быть пустым';
    }
    if (!validateAddress(counterparty.address)) {
      newErrors.address = 'Адрес не может быть пустым';
    }
    if (!validateInn(counterparty.inn)) {
      newErrors.inn = 'ИНН должен содержать 11 цифр';
    }
    if (!validateKpp(counterparty.kpp)) {
      newErrors.kpp = 'КПП должен содержать 9 цифр';
    }
    setErrors(newErrors);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateForm(formData);
    if (isValidConteParty(formData)) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const copy = { ...formData };
    if (name === 'inn' || name === 'kpp' || name === 'name' || name === 'address') {
      copy[name] = value;
    }
    validateForm(copy);
    setFormData(copy);
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <ModalHeader>{counterparty ? 'Редактировать контрагента' : 'Новый контрагент'}</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              color={errors.name ? 'failure' : undefined}
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>
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
              color={errors.inn ? 'failure' : undefined}
            />
            {errors.inn && <p className="text-red-600 text-xs mt-1">{errors.inn}</p>}
          </div>
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
              color={errors.address ? 'failure' : undefined}
            />
            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
          </div>
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
              color={errors.kpp ? 'failure' : undefined}
            />
            {errors.kpp && <p className="text-red-600 text-xs mt-1">{errors.kpp}</p>}
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="gray" onClick={onClose}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} disabled={!isValidConteParty({ ...formData })}>
          Сохранить
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CounterpartyModal;
