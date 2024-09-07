import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import {
  Stack,
  Paper,
  Alert,
  Button,
  useTheme,
  Snackbar,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createForm } from 'src/api/form/createForm';
import { createAirlink } from 'src/api/airlink/createAirlink';

import Iconify from 'src/components/iconify';

interface Component {
  type: string;
  label: string;
  options?: string[];
}

interface FormValues {
  title: string;
  description: string;
  components: Component[];
}

interface FormBuilderProps {
  formik: ReturnType<typeof useFormik<FormValues>>;
  selectedType: string | null;
  onWidgetAdded: (type: string, options?: string[]) => void;
  workspaceId: string;
}

export default function FormBuilder({
  formik,
  selectedType,
  onWidgetAdded,
  workspaceId,
}: FormBuilderProps) {
  const router = useRouter();
  const theme = useTheme();
  const [isTitleEditing, setIsTitleEditing] = useState<boolean>(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Error state for validation messages

  const { mutateAsync } = useMutation({
    mutationKey: ['create-airlink'],
    mutationFn: createAirlink,
  });

  const {
    data: createdFormData,
    isPending: isFormCreated,
    mutateAsync: formMutateAsync,
  } = useMutation({
    mutationKey: ['create-form'],
    mutationFn: createForm,
  });

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
    formik.handleSubmit();

    if (validateForm()) {
      const form = {
        title: formik.values.title,
        description: formik.values.description,
        questions: formik.values.components.map((item) =>
          item.type === 'connect-wallet'
            ? Object({ type: item.type, title: 'Connect Wallet', options: [] })
            : Object({ type: item.type, options: item.options, title: item.label })
        ),
      };

      mutateAsync({
        description: form.description,
        title: form.title,
        type: 'form',
        workspace: workspaceId,
      }).then((item: any) => {
        console.log('🚀 ~ saveForm ~ item:', item);
        // toast.success('Airlink created!', { duration: 2000 });
        // const airlinkId = item._id.toString();

        formMutateAsync({
          description: form.description,
          title: form.title,
          airlink: item._id,
          questions: form.questions,
        }).then((createdForm) => {
          toast.success('Form created!', { duration: 2000 });
          return router.push(paths.dashboard.root);
        });
      });
      console.log('Form saved:', form);
    }
  };

  return (
    <Stack spacing={2}>
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
