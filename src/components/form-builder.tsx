import { useState } from 'react';

import { Stack, Button, TextField, Typography } from '@mui/material';

interface Component {
  type: string;
  label: string;
  options?: string[];
}

export default function FormBuilder({ selectedType }: { selectedType: string | null }) {
  const [components, setComponents] = useState<Component[]>([]);
  const [currentLabel, setCurrentLabel] = useState<string>('');
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('Form Title');
  const [isTitleEditing, setIsTitleEditing] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('Form Description');
  const [isDescriptionEditing, setIsDescriptionEditing] = useState<boolean>(false);

  const addComponent = () => {
    if (selectedType) {
      setComponents([
        ...components,
        { type: selectedType, label: currentLabel, options: currentOptions },
      ]);
      setCurrentLabel('');
      setCurrentOptions([]);
    }
  };

  return (
    <Stack spacing={2}>
      {/* Title Section */}
      <Stack spacing={1}>
        {isTitleEditing ? (
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsTitleEditing(false)}
            autoFocus
            fullWidth
          />
        ) : (
          <Typography variant="h4" onClick={() => setIsTitleEditing(true)}>
            {title}
          </Typography>
        )}
      </Stack>

      {/* Description Section */}
      <Stack spacing={1}>
        {isDescriptionEditing ? (
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => setIsDescriptionEditing(false)}
            autoFocus
            fullWidth
          />
        ) : (
          <Typography variant="subtitle1" onClick={() => setIsDescriptionEditing(true)}>
            {description}
          </Typography>
        )}
      </Stack>

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
            {component.type === 'multiple-choice' ? (
              <TextField
                label="Seçenekler (Virgülle ayırın)"
                variant="outlined"
                fullWidth
                value={currentOptions.join(',')}
                onChange={(e) => setCurrentOptions(e.target.value.split(','))}
              />
            ) : null}
          </Stack>
        ))}
        <Button onClick={addComponent} variant="contained">
          Bileşen Ekle
        </Button>
      </Stack>
    </Stack>
  );
}
