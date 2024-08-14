import { useState, useEffect } from 'react';

import { Stack, Paper, Button, useTheme, TextField, Typography, IconButton } from '@mui/material';

import Iconify from 'src/components/iconify';

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
  const theme = useTheme();
  const [components, setComponents] = useState<Component[]>([]);
  const [title, setTitle] = useState<string>('Form Title');
  const [isTitleEditing, setIsTitleEditing] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('Form Description');
  const [isDescriptionEditing, setIsDescriptionEditing] = useState<boolean>(false);

  useEffect(() => {
    if (selectedType) {
      addComponent(selectedType);
      onWidgetAdded(); // Notify parent when a widget is added
    }
  }, [onWidgetAdded, selectedType]);

  const addComponent = (type: string) => {
    const newComponent: Component = { type, label: '', options: type === 'text' ? [] : ['', ''] };
    setComponents((prevComponents) => [...prevComponents, newComponent]);
  };

  const handleOptionChange = (index: number, optionIndex: number, value: string) => {
    const newComponents = [...components];
    if (newComponents[index].options) {
      newComponents[index].options![optionIndex] = value;
    }
    setComponents(newComponents);
  };

  const removeComponent = (index: number) => {
    setComponents((prevComponents) => prevComponents.filter((_, i) => i !== index));
  };

  const removeOption = (componentIndex: number, optionIndex: number) => {
    const newComponents = [...components];
    if (newComponents[componentIndex].options) {
      newComponents[componentIndex].options = newComponents[componentIndex].options!.filter(
        (_, i) => i !== optionIndex
      );
    }
    setComponents(newComponents);
  };

  const moveComponent = (index: number, direction: 'up' | 'down') => {
    const newComponents = [...components];
    const [movedComponent] = newComponents.splice(index, 1);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    newComponents.splice(newIndex, 0, movedComponent);
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
        {isTitleEditing || title?.length === 0 ? (
          <TextField
            value={title}
            placeholder="Title"
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
        {isDescriptionEditing || description?.length === 0 ? (
          <TextField
            value={description}
            placeholder="Description"
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
      <Stack spacing={2} mt={1}>
        {components.map((component, index) => (
          <Paper key={index} elevation={4} sx={{ p: 1.5 }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">
                  {`Question ${index + 1} `}
                  <span
                    style={{
                      textTransform: 'capitalize',
                      fontSize: 12,
                      color:
                        // eslint-disable-next-line no-nested-ternary
                        component.type === 'text'
                          ? theme.palette.warning.main
                          : component.type === 'radio'
                            ? theme.palette.info.main
                            : theme.palette.error.main,
                    }}
                  >{`(${component.type})`}</span>
                </Typography>
                <Stack direction="row">
                  <IconButton
                    size="small"
                    onClick={() => moveComponent(index, 'up')}
                    disabled={index === 0}
                  >
                    <Iconify icon="solar:arrow-up-bold" />
                  </IconButton>
                  <IconButton
                    onClick={() => moveComponent(index, 'down')}
                    size="small"
                    disabled={index === components.length - 1}
                  >
                    <Iconify icon="solar:arrow-down-bold" />
                  </IconButton>
                  <IconButton sx={{ ml: 1 }} color="error" onClick={() => removeComponent(index)}>
                    <Iconify icon="solar:close-circle-bold" />
                  </IconButton>
                </Stack>
              </Stack>
              <TextField
                label="Soru Metni"
                variant="filled"
                fullWidth
                value={component.label}
                onChange={(e) => {
                  const newComponents = [...components];
                  newComponents[index].label = e.target.value;
                  setComponents(newComponents);
                }}
              />
              {component.type !== 'text' && (
                <Typography variant="subtitle2" mt={1}>
                  Options
                </Typography>
              )}
              {(component.type === 'radio' || component.type === 'multiple-choice') &&
                component.options?.map((option, optionIndex) => (
                  <Stack direction="row" alignItems="center" key={optionIndex} spacing={1}>
                    <TextField
                      label={`Seçenek ${optionIndex + 1}`}
                      variant="outlined"
                      fullWidth
                      value={option}
                      onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                    />
                    <IconButton onClick={() => removeOption(index, optionIndex)}>
                      <Iconify icon="solar:close-circle-bold" />
                    </IconButton>
                  </Stack>
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
          </Paper>
        ))}
      </Stack>

      {/* Save Form Button */}
      <Button variant="contained" color="primary" onClick={saveForm}>
        Save Form
      </Button>
    </Stack>
  );
}
