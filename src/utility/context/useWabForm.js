import { useContext } from 'react';
import { WabFormContext } from './WabFormContext';

export function useWabForm() {
  return useContext(WabFormContext);
}
