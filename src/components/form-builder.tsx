import { useState, useEffect } from 'react';

import { Stack, Button, TextField, Typography } from '@mui/material';

interface Component {
  type: string;
  label: string;
  options?: string[];
}

export default function FormBuilder({
  selectedType,
  onWidgetAdded,
}: {
  selectedType: string | null;
  onWidgetAdded: () => void;
}) {
  const [components, setComponents] = useState<Component[]>([]);
  const [title, setTitle] = useState<string>('Form Title');
  const [isTitleEditing, setIsTitleEditing] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('Form Description');
  const [isDescriptionEditing, setIsDescriptionEditing] = useState<boolean>(false);

  useEffect(() => {
    if (selectedType) {
      addComponent(selectedType);
      onWidgetAdded(); // Widget eklendikten sonra parent'a haber veriyoruz
    }
  }, [onWidgetAdded, selectedType]);

  const addComponent = (type: string) => {
    const newComponent: Component = { type, label: '', options: type === 'text' ? [] : ['', ''] }; // radio ve multiple-choice için en az 2 seçenek

    setComponents((prevComponents) => [...prevComponents, newComponent]);
  };

  const handleOptionChange = (index: number, optionIndex: number, value: string) => {
    const newComponents = [...components];
    if (newComponents[index].options) {
      newComponents[index].options![optionIndex] = value;
    }
    setComponents(newComponents);
  };

  const saveForm = () => {
    const form = {
      title,
      description,
      components,
    };
    console.log('Form saved:', form);
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

      {/* Form Components Section */}
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
            {(component.type === 'radio' || component.type === 'multiple-choice') &&
              component.options?.map((option, optionIndex) => (
                <TextField
                  key={optionIndex}
                  label={`Seçenek ${optionIndex + 1}`}
                  variant="outlined"
                  fullWidth
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                />
              ))}
            {(component.type === 'radio' || component.type === 'multiple-choice') &&
              component.options &&
              component.options.length < 5 && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    const newComponents = [...components];
                    newComponents[index].options?.push('');
                    setComponents(newComponents);
                  }}
                >
                  Yeni Seçenek Ekle
                </Button>
              )}
          </Stack>
        ))}
      </Stack>

      {/* Save Form Button */}
      <Button variant="contained" color="primary" onClick={saveForm}>
        Save Form
      </Button>
    </Stack>
  );
}
