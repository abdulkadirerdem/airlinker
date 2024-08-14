// form-builder.tsx
import { useState, useEffect, useCallback } from 'react';

import { Stack, TextField } from '@mui/material';

interface Component {
  type: string;
  label: string;
  options?: string[];
}

export default function FormBuilder({
  selectedType,
  defaultOptions,
}: {
  selectedType: string | null;
  defaultOptions?: string[];
}) {
  const [components, setComponents] = useState<Component[]>([]);
  const [currentLabel, setCurrentLabel] = useState<string>('');
  const [currentOptions, setCurrentOptions] = useState<string[]>(defaultOptions || []);

  const addComponent = useCallback(() => {
    if (selectedType) {
      setComponents([
        ...components,
        { type: selectedType, label: currentLabel, options: currentOptions },
      ]);
      setCurrentLabel('');
      setCurrentOptions([]);
    }
  }, [components, currentLabel, currentOptions, selectedType]);

  useEffect(() => {
    if (selectedType) {
      addComponent();
    }
  }, [addComponent, selectedType]);

  return (
    <Stack spacing={2}>
      <Stack spacing={2}>
        {components.map((component, index) => (
          <Stack key={index} spacing={1}>
            <TextField
              label="Soru Metni"
              variant="outlined"
              fullWidth
              value={component.label}
              onChange={(e) => {
                const newComponents = [...components];
                newComponents[index].label = e.target.value;
                setComponents(newComponents);
              }}
            />
            {component.type === 'multiple-choice' && (
              <TextField
                label="Seçenekler (Virgülle ayırın)"
                variant="outlined"
                fullWidth
                value={currentOptions.join(',')}
                onChange={(e) => setCurrentOptions(e.target.value.split(','))}
              />
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
