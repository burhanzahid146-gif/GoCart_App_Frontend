import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getMe } from "../features/authenticationSlice/authenticationSlice" 
import api from "../Services/api" 
import {
    Box, Typography, TextField, Button,
    Avatar, Chip, Divider, Alert, CircularProgress, Grid, IconButton, Tooltip
} from "@mui/material"
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'

function Profile() {
    const dispatch = useDispatch()
    const fileInputRef = useRef(null)

    const user = useSelector(state => state.authentication.user)
    const token = useSelector(state => state.authentication.token)

    useEffect(() => {
        if (!user && token) {
            dispatch(getMe())
        }
    }, [dispatch, user, token])

    const [editMode, setEditMode] = useState(false)
    const [serverError, setServerError] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [saving, setSaving] = useState(false)

    
   const getAvatarUrl = (path) => {
    if (!path) return "";
   
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
        return path;
    }
    
    const normalizedPath = path.replace(/\\/g, "/");
    const cleanPath = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
    return `http://localhost:5000${cleanPath}`;
    };

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        avatarFile: null,
        avatarPreview: ""
    })

    
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                avatarPreview: getAvatarUrl(user?.avatar || user?.profilePic || "")
            }))
        }
    }, [user])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    
    const handleAvatarSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData({
            ...formData,
            avatarFile: file,
            avatarPreview: URL.createObjectURL(file) 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerError("")
        setSuccessMsg("")
        setSaving(true)
        
        try {
            const userId = user?.id || user?._id;
            const data = new FormData();
            
            data.append("name", formData.name);
            data.append("email", formData.email);
            
         
            if (formData.avatarFile) {
                data.append("avatar", formData.avatarFile); 
            }

            const response = await api.patch(`/users/${userId}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccessMsg(response.data.message || "Profile updated successfully!")
            setEditMode(false)
            dispatch(getMe()) 

            setTimeout(() => {
                setSuccessMsg("");
            }, 5000); 

        } catch (error) {
            setServerError(error?.response?.data?.message || error?.message || "Something went wrong")
        } finally {
            setSaving(false)
        }
    }

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const capitalizeName = (str) => {
        if (!str) return '';
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    if (!user) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#121212" }}>
                <CircularProgress sx={{ color: "#ffb703" }} />
            </Box>
        )
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#121212", pt: 12, pb: 8, px: { xs: 2, sm: 4 } }}>
            <Box sx={{ maxWidth: 960, mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>

             
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarSelect} 
                    accept="image/*" 
                    style={{ display: "none" }} 
                />

               
                <Box sx={{ 
                    bgcolor: "#1e1e1e", 
                    borderRadius: 3, 
                    border: '1.5px solid rgba(255, 183, 3, 0.4)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)', 
                    p: { xs: 3, sm: 4 }
                }}>
                    <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'center' }, gap: 3, justifyContent: 'space-between' }}>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                            
                           
                            <Box sx={{ position: 'relative' }}>
                                <Avatar 
                                    src={formData.avatarPreview} 
                                    sx={{ 
                                        width: 80, 
                                        height: 80, 
                                        bgcolor: "#ffb703", 
                                        color: "#121212",
                                        fontSize: 28, 
                                        fontWeight: 900,
                                        boxShadow: '0 0 15px rgba(255, 183, 3, 0.5)',
                                        cursor: editMode ? 'pointer' : 'default'
                                    }}
                                    onClick={() => editMode && fileInputRef.current.click()}
                                >
                                    {!formData.avatarPreview && getInitials(formData.name)}
                                </Avatar>

                                {editMode && (
                                    <Tooltip title="Change Avatar">
                                        <IconButton
                                            onClick={() => fileInputRef.current.click()}
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                bgcolor: '#ffb703',
                                                color: '#121212',
                                                padding: '4px',
                                                '&:hover': { bgcolor: '#ffc833' },
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
                                            }}
                                            size="small"
                                        >
                                            <PhotoCameraIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1, mb: 0.5 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff' }}>
                                        {capitalizeName(user?.name)}
                                    </Typography>
                                    <VerifiedUserOutlinedIcon sx={{ color: '#ffb703', fontSize: 20 }} />
                                </Box>

                                <Typography variant="body2" sx={{ color: "#ffffff", mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1, opacity: 0.9 }}>
                                    <EmailOutlinedIcon sx={{ fontSize: 16, color: '#ffb703' }} /> {user?.email}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                    <Chip 
                                        label={user?.role || 'User'} 
                                        size="small" 
                                        sx={{ 
                                            bgcolor: "rgba(255, 183, 3, 0.15)", 
                                            color: "#ffc107", 
                                            fontWeight: 700, 
                                            border: '1px solid rgba(255, 183, 3, 0.4)',
                                            textTransform: "capitalize",
                                            height: 24
                                        }} 
                                    />
                                    <Chip 
                                        label="Active" 
                                        size="small" 
                                        sx={{ 
                                            bgcolor: "rgba(34, 197, 94, 0.15)", 
                                            color: "#4ade80", 
                                            fontWeight: 700, 
                                            border: '1px solid rgba(34, 197, 94, 0.4)',
                                            height: 24
                                        }} 
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Button
                            variant={editMode ? "outlined" : "contained"}
                            onClick={() => { 
                                setEditMode(!editMode); 
                                setServerError(""); 
                                setSuccessMsg("");
                                if (editMode && user) {
                                    setFormData({
                                        name: user.name || "",
                                        email: user.email || "",
                                        avatarFile: null,
                                        avatarPreview: getAvatarUrl(user?.avatar || user?.profilePic || "")
                                    })
                                }
                            }}
                            startIcon={<EditOutlinedIcon />}
                            sx={{
                                borderRadius: '8px', 
                                fontWeight: 700,
                                textTransform: 'none',
                                px: 3,
                                height: 40,
                                ...(editMode
                                    ? { borderColor: "#ffb703", color: "#ffb703", '&:hover': { bgcolor: 'rgba(255, 183, 3, 0.15)' } }
                                    : { bgcolor: "#ffb703", color: '#121212', "&:hover": { bgcolor: "#ffc833" }, boxShadow: '0 0 12px rgba(255, 183, 3, 0.4)' })
                            }}
                        >
                            {editMode ? "Cancel" : "Edit Profile"}
                        </Button>
                    </Box>
                </Box>

                {serverError && <Alert severity="error" sx={{ borderRadius: 2 }}>{serverError}</Alert>}
                {successMsg && <Alert severity="success" sx={{ borderRadius: 2 }}>{successMsg}</Alert>}

                <Grid container spacing={3}>
                    
                   
                    <Grid item xs={12} md={7}>
                        <Box 
                            component="form" 
                            onSubmit={handleSubmit}
                            sx={{ 
                                bgcolor: "#1e1e1e", 
                                borderRadius: 3, 
                                border: '1.5px solid rgba(255, 183, 3, 0.4)',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)', 
                                p: 3.5,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 0.5 }}>
                                Personal Information
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ffffff', opacity: 0.8, mb: 3 }}>
                                Update your account profile information and picture.
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, flexGrow: 1 }}>
                                <TextField 
                                    fullWidth 
                                    label="Full Name" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    disabled={!editMode} 
                                    size="medium"
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ 
                                        "& .MuiOutlinedInput-root": { 
                                            borderRadius: '8px', 
                                            color: '#ffffff',
                                            bgcolor: '#121212',
                                            '& fieldset': { borderColor: 'rgba(255, 183, 3, 0.4)' },
                                            '&:hover fieldset': { borderColor: '#ffb703' },
                                            '&.Mui-focused fieldset': { borderColor: '#ffb703', borderWidth: '2px' }
                                        },
                                        "& .MuiInputLabel-root": { color: '#ffb703', fontWeight: 600 },
                                        "& .MuiInputLabel-root.Mui-focused": { color: '#ffb703' },
                                        "& .MuiInputBase-input": { color: '#ffffff !important' },
                                        "& .MuiInputBase-input.Mui-disabled": { 
                                            WebkitTextFillColor: '#ffffff !important', 
                                            color: '#ffffff !important' 
                                        }
                                    }} 
                                />

                                <TextField 
                                    fullWidth 
                                    label="Email Address" 
                                    name="email" 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    disabled={!editMode} 
                                    size="medium"
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ 
                                        "& .MuiOutlinedInput-root": { 
                                            borderRadius: '8px', 
                                            color: '#ffffff',
                                            bgcolor: '#121212',
                                            '& fieldset': { borderColor: 'rgba(255, 183, 3, 0.4)' },
                                            '&:hover fieldset': { borderColor: '#ffb703' },
                                            '&.Mui-focused fieldset': { borderColor: '#ffb703', borderWidth: '2px' }
                                        },
                                        "& .MuiInputLabel-root": { color: '#ffb703', fontWeight: 600 },
                                        "& .MuiInputLabel-root.Mui-focused": { color: '#ffb703' },
                                        "& .MuiInputBase-input": { color: '#ffffff !important' },
                                        "& .MuiInputBase-input.Mui-disabled": { 
                                            WebkitTextFillColor: '#ffffff !important', 
                                            color: '#ffffff !important' 
                                        }
                                    }} 
                                />

                                {editMode && (
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        fullWidth 
                                        disabled={saving}
                                        sx={{ 
                                            mt: 'auto', 
                                            py: 1.2, 
                                            borderRadius: '8px', 
                                            fontWeight: 700, 
                                            bgcolor: "#ffb703", 
                                            color: '#121212',
                                            textTransform: 'none',
                                            boxShadow: '0 0 12px rgba(255, 183, 3, 0.4)',
                                            '&:hover': { bgcolor: "#ffc833" }
                                        }}
                                    >
                                        {saving ? <CircularProgress size={22} color="inherit" /> : "Save Changes"}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    
                    <Grid item xs={12} md={5}>
                        <Box sx={{ 
                            bgcolor: "#1e1e1e", 
                            borderRadius: 3, 
                            border: '1.5px solid rgba(255, 183, 3, 0.4)',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)', 
                            p: 3.5,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 0.5 }}>
                                    System Details
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#ffffff', opacity: 0.8, mb: 3 }}>
                                    Security & account metadata.
                                </Typography>

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                                            <BadgeOutlinedIcon sx={{ color: '#ffb703', fontSize: 20 }} />
                                            <Typography variant="body2" sx={{ color: "#ffffff" }}>User ID</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem', color: "#ffffff", opacity: 0.9, fontFamily: 'monospace', textAlign: 'right', wordBreak: 'break-all', maxWidth: '60%' }}>
                                            {user?.id || user?._id || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ borderColor: 'rgba(255, 183, 3, 0.2)' }} />

                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <CalendarMonthOutlinedIcon sx={{ color: '#ffb703', fontSize: 20 }} />
                                            <Typography variant="body2" sx={{ color: "#ffffff" }}>Member Since</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff', fontSize: '0.85rem' }}>
                                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" }) : "Recent"}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ borderColor: 'rgba(255, 183, 3, 0.2)' }} />

                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <EditOutlinedIcon sx={{ color: '#ffb703', fontSize: 20 }} />
                                            <Typography variant="body2" sx={{ color: "#ffffff" }}>Last Modified</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff', fontSize: '0.85rem' }}>
                                            {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" }) : "Just now"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255, 183, 3, 0.2)' }}>
                                <Typography variant="caption" sx={{ color: '#ffffff', opacity: 0.9, display: 'block', textAlign: 'center', fontWeight: 500 }}>
                                    GoCart Secure Auth System
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                </Grid>

            </Box>
        </Box>
    )
}

Profile.displayName = 'Profile'

export default Profile