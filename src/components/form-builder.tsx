import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import {
  Stack,
  Paper,
  Alert,
  Radio,
  Button,
  useTheme,
  Snackbar,
  Checkbox,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Box,
} from '@mui/material';

import { FormValues } from 'src/constants/types';

import Iconify from 'src/components/iconify';

interface FormBuilderProps {
  formik: ReturnType<typeof useFormik<FormValues>>;
  selectedType: string | null;
  onWidgetAdded: (type: string, options?: string[]) => void;
  formType?: string;
}

export default function FormBuilder({
  formik,
  selectedType,
  onWidgetAdded,
  formType,
}: FormBuilderProps) {
  const theme = useTheme();
  const [isTitleEditing, setIsTitleEditing] = useState<boolean>(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Error state for validation messages
  const [prize, setPrize] = useState<string>('');

  useEffect(() => {
    if (selectedType) {
      onWidgetAdded(selectedType);
    }
  }, [onWidgetAdded, selectedType]);

  const removeComponent = (index: number) => {
    const newComponents = formik.values.components.filter((_, i) => i !== index);
    formik.setFieldValue('components', newComponents);
  };

  const handleOptionChange = (componentIndex: number, optionIndex: number, value: string) => {
    const newComponents = [...formik.values.components];
    if (newComponents[componentIndex].options) {
      newComponents[componentIndex].options![optionIndex] = value;
      formik.setFieldValue('components', newComponents);
    }
  };

  const removeOption = (componentIndex: number, optionIndex: number) => {
    const newComponents = [...formik.values.components];
    if (newComponents[componentIndex].options) {
      newComponents[componentIndex].options = newComponents[componentIndex].options!.filter(
        (_, i) => i !== optionIndex
      );
      formik.setFieldValue('components', newComponents);
    }
  };

  const moveComponent = (index: number, direction: 'up' | 'down') => {
    const newComponents = [...formik.values.components];
    const [movedComponent] = newComponents.splice(index, 1);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    newComponents.splice(newIndex, 0, movedComponent);
    formik.setFieldValue('components', newComponents);
  };

  const validateForm = (): boolean => {
    if (formik.values.components?.length === 0) {
      setError('Add some questions.');
      return false;
    }

    // Check if title and description are not empty
    if (!formik.values.title.trim() || !formik.values.description.trim()) {
      setError('Title and Description cannot be empty.');
      return false;
    }

    // Check each component for validity
    const invalidComponent = formik.values.components.find((component) => {
      if (component.type !== 'connect-wallet' && !component.label.trim()) {
        setError('All question labels must be filled.');
        return true;
      }

      if (
        (component.type === 'radio' || component.type === 'multiple-choice') &&
        (!component.options || component.options.some((option) => !option.trim()))
      ) {
        setError('All options must be filled.');
        return true;
      }

      if (
        (component.type === 'radio' || component.type === 'multiple-choice') &&
        (component.options === undefined ||
          component.options?.length < 2 ||
          component.options?.length > 5)
      ) {
        setError('Options must be between 2 and 5.');
        return true;
      }

      if (formType === 'quiz') {
        if (component.type === 'radio' || component.type === 'multiple-choice') {
          if (!component.correctAnswer || component.correctAnswer.length === 0) {
            setError('At least one correct answer must be provided.');
            return true;
          }
        }

        if (component.type === 'text') {
          if (!component.correctAnswer || component.correctAnswer.length === 0) {
            setError('A correct answer must be provided for text type.');
            return true;
          }
        }
      }

      return false;
    });

    if (invalidComponent) {
      return false;
    }

    // No errors
    setError(null);
    return true;
  };

  const saveForm = () => {
    if (validateForm()) formik.handleSubmit();
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stack spacing={2} sx={{ flex: 1 }}>
          {/* Title Section */}
          <Stack spacing={1}>
            {isTitleEditing || formik.values.title.length === 0 ? (
              <TextField
                value={formik.values.title}
                placeholder="Title"
                onChange={(e) => formik.setFieldValue('title', e.target.value)}
                onBlur={() => setIsTitleEditing(false)}
                autoFocus
                fullWidth
              />
            ) : (
              <Typography variant="h4" onClick={() => setIsTitleEditing(true)}>
                {formik.values.title}
              </Typography>
            )}
          </Stack>

          {/* Description Section */}
          <Stack spacing={1}>
            {isDescriptionEditing || formik.values.description.length === 0 ? (
              <TextField
                value={formik.values.description}
                placeholder="Description"
                onChange={(e) => formik.setFieldValue('description', e.target.value)}
                onBlur={() => setIsDescriptionEditing(false)}
                autoFocus
                fullWidth
              />
            ) : (
              <Typography variant="subtitle1" onClick={() => setIsDescriptionEditing(true)}>
                {formik.values.description}
              </Typography>
            )}
          </Stack>
        </Stack>

        {/* Solana Prize Input */}

        <TextField
          label="Solana Prize"
          variant="outlined"
          size="small"
          value={prize}
          onChange={(e) => {
            setPrize(e.target.value);
            formik.setFieldValue('prize', e.target.value);
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">SOL</InputAdornment>,
          }}
          sx={{ width: '150px', ml: 2 }}
        />
      </Box>

      {/* Form Components Section */}
      <Stack spacing={2} mt={1}>
        {formik.values.components.map((component, index) => (
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
                    disabled={index === formik.values.components.length - 1}
                  >
                    <Iconify icon="solar:arrow-down-bold" />
                  </IconButton>
                  <IconButton sx={{ ml: 1 }} color="error" onClick={() => removeComponent(index)}>
                    <Iconify icon="solar:close-circle-bold" />
                  </IconButton>
                </Stack>
              </Stack>
              {component.type !== 'connect-wallet' ? (
                <>
                  <TextField
                    label="Soru Metni"
                    variant="filled"
                    fullWidth
                    value={component.label}
                    onChange={(e) => {
                      const newComponents = [...formik.values.components];
                      newComponents[index].label = e.target.value;
                      formik.setFieldValue('components', newComponents);
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
                          label={`Option ${optionIndex + 1}`}
                          variant="outlined"
                          fullWidth
                          value={option}
                          onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        />

                        {/* Correct Answer Selection for Radio */}
                        {component.type === 'radio' && formType === 'quiz' && (
                          <Radio
                            checked={component.correctAnswer === option}
                            onChange={() => {
                              const newComponents = [...formik.values.components];
                              newComponents[index].correctAnswer = option; // Only one correct answer
                              formik.setFieldValue('components', newComponents);
                            }}
                          />
                        )}

                        {/* Correct Answer Selection for Multiple Choice */}
                        {component.type === 'multiple-choice' && formType === 'quiz' && (
                          <Checkbox
                            checked={component.correctAnswer?.includes(option)}
                            onChange={(e) => {
                              const newComponents = [...formik.values.components];
                              if (!newComponents[index].correctAnswer) {
                                newComponents[index].correctAnswer = [];
                              }
                              if (e.target.checked) {
                                // Add the selected answer
                                newComponents[index].correctAnswer!.push(option);
                              } else {
                                // Remove the unselected answer
                                newComponents[index].correctAnswer = newComponents[
                                  index
                                ].correctAnswer!.filter((answer: string) => answer !== option);
                              }
                              formik.setFieldValue('components', newComponents);
                            }}
                          />
                        )}

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
                          const newComponents = [...formik.values.components];
                          newComponents[index].options?.push('');
                          formik.setFieldValue('components', newComponents);
                        }}
                      >
                        Add New Option
                      </Button>
                    )}
                  {formType === 'quiz' && component.type === 'text' && (
                    <TextField
                      label="Correct Answer"
                      variant="outlined"
                      fullWidth
                      value={component.correctAnswer || ''}
                      onChange={(e) => {
                        const newComponents = [...formik.values.components];
                        newComponents[index].correctAnswer = e.target.value;
                        formik.setFieldValue('components', newComponents);
                      }}
                      sx={{ mt: 1 }}
                    />
                  )}
                </>
              ) : (
                <WalletMultiButton />
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Save Form Button */}
      <Button variant="contained" color="primary" onClick={saveForm}>
        Save Form
      </Button>

      {/* Error Snackbar */}
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
