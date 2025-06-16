import React, { useEffect, useRef, useState } from 'react';
import { Badge } from 'flowbite-react';
import { HiCheck, HiOutlineXCircle, HiPause } from 'react-icons/hi';
import apiService from '../../../services/ApiService';
import { cleanUpTimer, registrarTimer } from '../../utils/utils';

const getStatusColor = (status: 'OK' | 'ERROR' | 'LOADING') => {
  switch (status) {
    case 'OK':
      return 'green';
    case 'ERROR':
      return 'red';
    case 'LOADING':
    default:
      return 'yellow';
  }
};

const getStatusIcon = (status: 'OK' | 'ERROR' | 'LOADING') => {
  switch (status) {
    case 'OK':
      return HiCheck;
    case 'ERROR':
      return HiOutlineXCircle;
    case 'LOADING':
    default:
      return HiPause;
  }
};

const ServerStatusBadge = () => {
  const timerRef = useRef<number | null>(null);
  const [status, setStatus] = useState<'OK' | 'ERROR' | 'LOADING'>('LOADING');

  useEffect(() => {
    async function loadStatus() {
      try {
        const response = await apiService.get('/status');
        if (response.ok) {
          setStatus('OK');
        } else {
          setStatus('ERROR');
        }
      } catch (err) {
        setStatus('ERROR');
      }
    }

    loadStatus();
    registrarTimer(timerRef, loadStatus, 1000);
    return () => cleanUpTimer(timerRef);
  }, []);

  return (
    <Badge
      icon={getStatusIcon(status)}
      size="sm"
      color={getStatusColor(status)}
      className="ml-[5px] w-3 h-3 p-0 flex items-center justify-center text-xs"
    />
  );
};

export default ServerStatusBadge;
