import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getMe } from "../features/authenticationSlice/authenticationSlice" 
import api from "../Services/api" 
import {
    Box, Typography, TextField, Button,
    Avatar, Chip, Divider, Alert, CircularProgress, Grid, IconButton, Tooltip, Card, CardContent
} from "@mui/material"
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import SecurityIcon from '@mui/icons-material/Security'
import StorageIcon from '@mui/icons-material/Storage'
import VerifiedIcon from '@mui/icons-material/Verified'

function AdminProfile() {
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
        if (path.startsWith("http") || path.startsWith("blob")) {
            return path;
        }
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
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

            setSuccessMsg(response.data.message || "Admin profile updated successfully!")
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

    if (!user) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#121212" }}>
                <CircularProgress sx={{ color: "#ffb703" }} />
            </Box>
        )
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#121212", pt: 12, pb: 8, px: { xs: 2, sm: 4 } }}>
            <Box sx={{ maxWidth: 1000, mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarSelect} 
                    accept="image/*" 
                    style={{ display: "none" }} 
                />

                {/* Admin Header Banner */}
                <Box sx={{ 
                    bgcolor: "#1e1e1e", 
                    borderRadius: 3, 
                    border: '2px solid #ffb703',
                    boxShadow: '0 8px 32px rgba(255, 183, 3, 0.15)', 
                    p: { xs: 3, sm: 4 }
                }}>
                    <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar 
                                    src={formData.avatarPreview} 
                                    sx={{ 
                                        width: 85, 
                                        height: 85, 
                                        bgcolor: "#ffb703", 
                                        color: "#121212",
                                        fontSize: 30, 
                                        fontWeight: 900,
                                        boxShadow: '0 0 20px rgba(255, 183, 3, 0.6)',
                                        cursor: editMode ? 'pointer' : 'default'
                                    }}
                                    onClick={() => editMode && fileInputRef.current.click()}
                                >
                                    {!formData.avatarPreview && user?.name?.[0]}
                                </Avatar>

                                {editMode && (
                                    <Tooltip title="Change Admin Avatar">
                                        <IconButton
                                            onClick={() => fileInputRef.current.click()}
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                bgcolor: '#ffb703',
                                                color: '#121212',
                                                padding: '4px',
                                                '&:hover': { bgcolor: '#ffc833' }
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
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff' }}>
                                        {user?.name}
                                    </Typography>
                                    <AdminPanelSettingsIcon sx={{ color: '#ffb703', fontSize: 24 }} />
                                </Box>

                                <Typography variant="body2" sx={{ color: "#ffffff", mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1, opacity: 0.9 }}>
                                    <EmailOutlinedIcon sx={{ fontSize: 16, color: '#ffb703' }} /> {user?.email}
                                </Typography>

                                <Chip 
                                    label="Super Administrator" 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: "rgba(255, 183, 3, 0.2)", 
                                        color: "#ffb703", 
                                        fontWeight: 800, 
                                        border: '1px solid #ffb703',
                                        height: 26
                                    }} 
                                />
                            </Box>
                        </Box>

                        <Button
                            variant={editMode ? "outlined" : "contained"}
                            onClick={() => { 
                                setEditMode(!editMode); 
                                setServerError(""); 
                                setSuccessMsg("");
                            }}
                            startIcon={<EditOutlinedIcon />}
                            sx={{
                                borderRadius: '8px', 
                                fontWeight: 700,
                                textTransform: 'none',
                                px: 3,
                                height: 42,
                                ...(editMode
                                    ? { borderColor: "#ffb703", color: "#ffb703", '&:hover': { bgcolor: 'rgba(255, 183, 3, 0.15)' } }
                                    : { bgcolor: "#ffb703", color: '#121212', "&:hover": { bgcolor: "#ffc833" } })
                            }}
                        >
                            {editMode ? "Cancel" : "Edit Admin Profile"}
                        </Button>
                    </Box>
                </Box>

                {serverError && <Alert severity="error" sx={{ borderRadius: 2 }}>{serverError}</Alert>}
                {successMsg && <Alert severity="success" sx={{ borderRadius: 2 }}>{successMsg}</Alert>}

                <Grid container spacing={3}>
                    
                    {/* Left: Admin Details Edit Form */}
                    <Grid item xs={12} md={6}>
                        <Box 
                            component="form" 
                            onSubmit={handleSubmit}
                            sx={{ 
                                bgcolor: "#1e1e1e", 
                                borderRadius: 3, 
                                border: '1.5px solid rgba(255, 183, 3, 0.4)',
                                p: 3.5,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 0.5 }}>
                                Admin Credentials
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ffffff', opacity: 0.7, mb: 3 }}>
                                Manage your primary administrative identifiers.
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, flexGrow: 1 }}>
                                <TextField 
                                    fullWidth 
                                    label="Admin Name" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    disabled={!editMode} 
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ 
                                        "& .MuiOutlinedInput-root": { 
                                            borderRadius: '8px', color: '#ffffff', bgcolor: '#121212',
                                            '& fieldset': { borderColor: 'rgba(255, 183, 3, 0.4)' },
                                            '&:hover fieldset': { borderColor: '#ffb703' },
                                            '&.Mui-focused fieldset': { borderColor: '#ffb703' }
                                        },
                                        "& .MuiInputLabel-root": { color: '#ffb703', fontWeight: 600 },
                                        "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: '#ffffff !important' }
                                    }} 
                                />

                                <TextField 
                                    fullWidth 
                                    label="Admin Email" 
                                    name="email" 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    disabled={!editMode} 
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ 
                                        "& .MuiOutlinedInput-root": { 
                                            borderRadius: '8px', color: '#ffffff', bgcolor: '#121212',
                                            '& fieldset': { borderColor: 'rgba(255, 183, 3, 0.4)' },
                                            '&:hover fieldset': { borderColor: '#ffb703' },
                                            '&.Mui-focused fieldset': { borderColor: '#ffb703' }
                                        },
                                        "& .MuiInputLabel-root": { color: '#ffb703', fontWeight: 600 },
                                        "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: '#ffffff !important' }
                                    }} 
                                />

                                {editMode && (
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        fullWidth 
                                        disabled={saving}
                                        sx={{ 
                                            mt: 'auto', py: 1.2, borderRadius: '8px', fontWeight: 700, 
                                            bgcolor: "#ffb703", color: '#121212', textTransform: 'none',
                                            '&:hover': { bgcolor: "#ffc833" }
                                        }}
                                    >
                                        {saving ? <CircularProgress size={22} color="inherit" /> : "Save Admin Changes"}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right: Master System Privileges & Quick Stats */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ 
                            bgcolor: "#1e1e1e", 
                            borderRadius: 3, 
                            border: '1.5px solid rgba(255, 183, 3, 0.4)',
                            p: 3.5,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SecurityIcon sx={{ color: '#ffb703' }} /> System Privileges
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#ffffff', opacity: 0.7, mb: 3 }}>
                                    Overview of core platform permissions assigned to this account.
                                </Typography>

                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={6}>
                                        <Card sx={{ bgcolor: '#121212', border: '1px solid rgba(255, 183, 3, 0.3)' }}>
                                            <CardContent sx={{ p: '12px !important' }}>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <SupervisorAccountIcon sx={{ fontSize: 14, color: '#ffb703' }} /> Role Tier
                                                </Typography>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ffb703', mt: 0.5 }}>
                                                    Level 1 (Master)
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card sx={{ bgcolor: '#121212', border: '1px solid rgba(255, 183, 3, 0.3)' }}>
                                            <CardContent sx={{ p: '12px !important' }}>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <StorageIcon sx={{ fontSize: 14, color: '#4ade80' }} /> DB Status
                                                </Typography>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#4ade80', mt: 0.5 }}>
                                                    Fully Connected
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Typography variant="body2" sx={{ color: "#ffffff", opacity: 0.9 }}>Database Admin ID</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem', color: "#ffb703", fontFamily: 'monospace' }}>
                                            {user?.id || user?._id}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255, 183, 3, 0.2)' }} />
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Typography variant="body2" sx={{ color: "#ffffff", opacity: 0.9 }}>Global Security Audit</Typography>
                                        <Chip label="Passed" size="small" sx={{ bgcolor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', fontWeight: 700, height: 22 }} />
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255, 183, 3, 0.2)' }}>
                                <Typography variant="caption" sx={{ color: '#ffffff', opacity: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                    <VerifiedIcon sx={{ fontSize: 14, color: '#ffb703' }} /> Exclusive Admin Profile Console
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                </Grid>

            </Box>
        </Box>
    )
}

AdminProfile.displayName = 'AdminProfile'

export default AdminProfile