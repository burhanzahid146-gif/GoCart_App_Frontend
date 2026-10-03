import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Box, Typography, Button, TextField, Alert, IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { userLogin, userRegister } from "../Pages/features/authenticationSlice/authenticationSlice";

function ReuseableAuthenticationForm({
  fields = [{ name: "abc", type: "text", placeholder: "Backup Field" }],
  handler,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");
  
  // States to toggle visibility for password and confirmPassword independently
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setServerError("");
    try {
      if (handler === "register") {
        await dispatch(userRegister({ ...data, role: "user" })).unwrap();
        await dispatch(userLogin({ email: data.email, password: data.password })).unwrap();
        navigate("/");
      } else if (handler === "login") {
        await dispatch(userLogin({ email: data.email, password: data.password })).unwrap();
        navigate("/");
      }
    } catch (error) {
      if (handler === "login") {
        setError("email", {
          type: "manual",
          message: "Invalid credentials or account does not exist.",
        });
      }
      setServerError(error?.message || "An unexpected error occurred. Please try again.");
    }
  };

return (
    <Box sx={{
      minHeight: "calc(100vh - 70px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: 2,
      py: 4,
      bgcolor: "#111111",
    }}>
      <Box sx={{
        width: "100%",
        maxWidth: 440,
        bgcolor: "rgba(26, 26, 26, 0.75)",
        backdropFilter: 'blur(16px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 16px 40px 0 rgba(0, 0, 0, 0.45)',
        p: { xs: 3, sm: 4.5 },
      }}>
        {/* Title */}
        <Typography 
          variant="h5" 
          sx={{ 
            textAlign: "center", 
            fontWeight: 800, 
            mb: 1, 
            color: "#ffffff",
            fontFamily: '"Plus Jakarta Sans", sans-serif, system-ui',
            letterSpacing: '-0.5px'
          }}
        >
          {handler === "register" ? "Create an Account" : "Welcome Back"}
        </Typography>

        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: "center", 
            color: "#999999", 
            mb: 3.5,
            fontSize: '0.92rem'
          }}
        >
          {handler === "register"
            ? "Enter your details to register and start exploring"
            : "Please sign in to access your account"}
        </Typography>

        {/* Server error */}
        {serverError && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px' }}>
            {serverError}
          </Alert>
        )}

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}
        >
          {fields.map((eachField) => {
            const isPassword = eachField.name === "password";
            const isConfirmPassword = eachField.name === "confirmPassword";

            return (
              <Controller
                key={eachField.name}
                control={control}
                name={eachField.name}
                rules={{
                  required: `${eachField.placeholder || eachField.name} is required`,
                  ...(isPassword && {
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Min 8 chars, include uppercase, lowercase, number & symbol",
                    },
                  }),
                  ...(isConfirmPassword && {
                    validate: (value) => value === password || "Passwords do not match",
                  }),
                }}
                render={({ field: { onChange, onBlur, value } }) =>
                  eachField.type === "date" ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                      <Typography variant="body2" sx={{ color: "#cccccc", fontSize: '0.85rem' }} fontWeight={500}>
                        {eachField.placeholder}
                      </Typography>
                      <ReactDatePicker
                        selected={value || null}
                        onChange={onChange}
                        onBlur={onBlur}
                        dateFormat="yyyy-MM-dd"
                        className="custom-datepicker-input"
                      />
                      {errors[eachField.name] && (
                        <Typography sx={{ color: "#ff6f00", fontSize: '0.75rem', mt: 0.5 }}>
                          {errors[eachField.name].message}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <TextField
                      fullWidth
                      label={eachField.placeholder}
                      type={
                        isPassword
                          ? (showPassword ? "text" : "password")
                          : isConfirmPassword
                          ? (showConfirmPassword ? "text" : "password")
                          : eachField.type
                      }
                      value={value || ""}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={!!errors[eachField.name]}
                      helperText={errors[eachField.name]?.message}
                      size="small"
                      InputProps={{
                        endAdornment: (isPassword || isConfirmPassword) ? (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                if (isPassword) setShowPassword((prev) => !prev);
                                if (isConfirmPassword) setShowConfirmPassword((prev) => !prev);
                              }}
                              edge="end"
                              sx={{ color: "#aaaaaa", "&:hover": { color: "#ff6f00" } }}
                            >
                              {isPassword ? (
                                showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />
                              ) : (
                                showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          color: "#ffffff",
                          bgcolor: "rgba(255, 255, 255, 0.03)",
                          borderRadius: '12px',
                        },
                        '& label': { color: "#888888", fontSize: '0.9rem' },
                        '& label.Mui-focused': { color: "#ff6f00" },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: "rgba(255, 255, 255, 0.12)", borderRadius: '12px' },
                          '&:hover fieldset': { borderColor: "rgba(255, 111, 0, 0.5)" },
                          '&.Mui-focused fieldset': { borderColor: "#ff6f00", borderWidth: '1.5px' },
                        },
                        '& .MuiFormHelperText-root': { color: "#ff6f00", marginLeft: 0 }
                      }}
                    />
                  )
                }
              />
            );
          })}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              mt: 1.5,
              py: 1.4,
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)',
              color: '#ffffff',
              boxShadow: '0px 6px 20px rgba(255, 111, 0, 0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              "&:hover": {
                background: 'linear-gradient(135deg, #e06000 0%, #e07f00 100%)',
                boxShadow: '0px 8px 24px rgba(255, 111, 0, 0.5)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {isSubmitting ? "Processing..." : handler === "register" ? "Create Account" : "Sign In"}
          </Button>
        </Box>

        {/* Footer link */}
        <Typography variant="body2" sx={{ textAlign: "center", mt: 3.5, color: "#888888", fontSize: '0.9rem' }}>
          {handler === "register" ? "Already have an account? " : "Don't have an account? "}
          <Box
            component="span"
            onClick={() => navigate(handler === "register" ? "/login" : "/register")}
            sx={{ 
              color: "#ff6f00", 
              fontWeight: 700, 
              cursor: "pointer", 
              "&:hover": { textDecoration: "underline" } 
            }}
          >
            {handler === "register" ? "Sign In" : "Register Now"}
          </Box>
        </Typography>

      </Box>
    </Box>
  );
}

export default ReuseableAuthenticationForm;