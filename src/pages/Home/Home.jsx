import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Fade,
  Slide,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import GrassIcon from '@mui/icons-material/Grass';
import TimelineIcon from '@mui/icons-material/Timeline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GroupIcon from '@mui/icons-material/Group';

const features = [
  {
    icon: <AgricultureIcon color="success" sx={{ fontSize: 40 }} />,
    title: "Farm-to-Table Traceability",
    description: "Track every step of your produce from the farm to the consumer with blockchain-powered transparency."
  },
  {
    icon: <VerifiedUserIcon color="primary" sx={{ fontSize: 40 }} />,
    title: "Digital Certification",
    description: "Get your organic produce certified and verified digitally, reducing paperwork and fraud."
  },
  {
    icon: <TimelineIcon color="secondary" sx={{ fontSize: 40 }} />,
    title: "Smart Analytics",
    description: "Leverage real-time analytics to optimize your supply chain and improve decision making."
  },
  {
    icon: <EmojiNatureIcon color="success" sx={{ fontSize: 40 }} />,
    title: "Sustainable Practices",
    description: "Promote and monitor sustainable farming practices for a greener future."
  }
];

const howItWorks = [
  {
    step: 1,
    title: "Register & Onboard",
    description: "Sign up as a farmer, inspector, or certifier. Complete your profile and get verified.",
    image: "https://img.icons8.com/color/96/000000/add-user-group-man-man.png"
  },
  {
    step: 2,
    title: "Submit Certification Request",
    description: "Farmers submit requests for organic certification with supporting documents and media.",
    image: "https://img.icons8.com/color/96/000000/submit-for-approval.png"
  },
  {
    step: 3,
    title: "Inspection & Verification",
    description: "Inspectors review requests, conduct field visits, and upload findings.",
    image: "https://img.icons8.com/color/96/000000/inspection.png"
  },
  {
    step: 4,
    title: "Certificate Issued",
    description: "Certifiers review and issue digital certificates, anchored on blockchain.",
    image: "https://img.icons8.com/color/96/000000/certificate.png"
  }
];

const stats = [
  { label: "Farmers Onboarded", value: 1200, icon: <GroupIcon color="success" /> },
  { label: "Certificates Issued", value: 3500, icon: <VerifiedUserIcon color="primary" /> },
  { label: "Supply Chains Tracked", value: 180, icon: <TimelineIcon color="secondary" /> },
  { label: "Countries Served", value: 12, icon: <EmojiNatureIcon color="success" /> }
];

const faqs = [
  { question: "What is AgriChain?", answer: "AgriChain is a blockchain-powered platform for organic supply chain management, certification, and traceability." },
  { question: "How do I get certified?", answer: "Sign up, submit your farm details, and follow the guided certification process. Inspectors will review and approve your application." },
  { question: "Is my data secure?", answer: "Yes, all data is encrypted and anchored on blockchain for maximum security and transparency." },
  { question: "Can buyers verify my certificates?", answer: "Absolutely! Buyers can scan your QR code or search your certificate on the platform." }
];

const animatedBg = {
  minHeight: '100vh',
  background: 'linear-gradient(270deg, #e0f7fa, #f1f8e9, #b2dfdb, #e0f7fa)',
  backgroundSize: '400% 400%',
  animation: 'gradientBG 20s ease infinite',
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'repeat',
  backgroundSize: 'cover',
  display: 'flex',
  flexDirection: 'column'
};

export default function Home() {
  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you with organic supply chain management today?' }
  ]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Chatbot send handler
  const handleSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { from: 'user', text: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(msgs => [
        ...msgs,
        { from: 'bot', text: 'Thank you for your message! (This is a demo bot.)' }
      ]);
    }, 800);
  };

  const backgroundPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='1' width='58' height='58' rx='12' fill='%23ffffff' fill-opacity='0.7' stroke='%23a5d6a7' stroke-width='2'/%3E%3Ccircle cx='30' cy='30' r='6' fill='%23a5d6a7' fill-opacity='0.3'/%3E%3C/svg%3E")`;

  return (
    <Box sx={animatedBg}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ background: 'rgb(240 249 233)' }}>
        <Toolbar>
        <img
              src="/gopca-logo.png"
              alt="GOPCA Logo"
              style={{ height: 48, marginRight: 16 }}
            />
          <Typography variant="h5" sx={{ flexGrow: 1, color: 'green', fontWeight: 800, letterSpacing: 1 }}>
            AgriChain
          </Typography>
          <Button href="/login" color="success" variant="outlined" sx={{ mr: 2 }}>Sign In</Button>
          <Button href="/register" color="success" variant="contained">Sign Up</Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section with fixed background */}
    <Box
      sx={{
          minHeight: 500,
          background: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat`,
          backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', color: '#fff', zIndex: 2 }}>
          <Typography variant="h2" fontWeight={900} sx={{ mb: 2, letterSpacing: 2 }}>
            Organic Supply Chain, Reimagined
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Digitize, track, and certify your produce with trust, transparency, and blockchain.
          </Typography>
          <Button href="/register" size="large" variant="contained" color="success" sx={{ px: 5, fontWeight: 700, fontSize: 20 }}>
            Get Started
          </Button>
        </Container>
        {/* SVG wave divider */}
        <Box sx={{ position: 'absolute', bottom: -1, left: 0, width: '100%', zIndex: 1 }}>
          <svg viewBox="0 0 1440 80" width="100%" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f1f8e9" d="M0,80 C480,0 960,160 1440,80 L1440,160 L0,160 Z" />
          </svg>
        </Box>
      </Box>

      {/* Platform Features Section with visible background image and overlay */}
      <Box
        sx={{
          position: 'relative',
          py: 8,
          background: `
            linear-gradient(rgba(56,142,60,0.25),rgba(56,142,60,0.25)),
            url('h') center/cover no-repeat
          `,
          backgroundAttachment: 'fixed',
          overflow: 'hidden'
        }}
      >
        {/* Optional: Animated SVG elements for extra effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 1440 320" style={{ position: 'absolute', top: 0 }}>
            {/* Sun */}
            <circle cx="1200" cy="80" r="40" fill="#ffe082" opacity="0.5">
              <animate attributeName="cx" values="1200;1000;1200" dur="10s" repeatCount="indefinite" />
            </circle>
            {/* Cloud */}
            <ellipse cx="300" cy="80" rx="60" ry="30" fill="#fff" opacity="0.2">
              <animate attributeName="cx" values="300;600;300" dur="18s" repeatCount="indefinite" />
            </ellipse>
          </svg>
        </Box>

        {/* Features content with zIndex: 1 */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Container maxWidth="xl">
            <Typography variant="h4" fontWeight={800} color="#388e3c" align="center" gutterBottom>
              Platform Features
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'row', md: 'row' },
                overflowX: { xs: 'auto', md: 'visible' },
                gap: 3,
                py: 2,
                px: 1,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                justifyContent: 'center'
              }}
            >
              {features.map((feature, idx) => (
                <Paper
                  key={idx}
                  elevation={4}
                  sx={{
                    minWidth: 240,
                    maxWidth: 260,
                    p: 3,
                    borderRadius: 3,
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.85)',
                    border: '1.5px solid #a5d6a7',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: 10 }
                  }}
                >
                  {feature.icon}
                  <Typography variant="subtitle1" fontWeight={700} color="#388e3c" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" fontSize={15}>
                    {feature.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Container>
        </Box>
      </Box>

      {/* How It Works Section - Animated Timeline */}
      <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="#388e3c" align="center" gutterBottom>
          How It Works
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            mt: 6,
            position: 'relative'
          }}
        >
          {[
            {
              label: "Register",
              icon: <GroupIcon sx={{ fontSize: 40, color: '#388e3c' }} />,
              color: '#e8f5e9',
              desc: "Sign up as a farmer, inspector, or certifier."
            },
            {
              label: "Request",
              icon: <VerifiedUserIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
              color: '#e3f2fd',
              desc: "Submit your certification request."
            },
            {
              label: "Inspect",
              icon: <TimelineIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
              color: '#ffebee',
              desc: "Inspection and verification by experts."
            },
            {
              label: "Certify",
              icon: <EmojiNatureIcon sx={{ fontSize: 40, color: '#43a047' }} />,
              color: '#f1f8e9',
              desc: "Get your digital certificate on blockchain."
            }
          ].map((step, idx, arr) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
                animation: `fadeInUp 0.7s ${idx * 0.3 + 0.2}s both`
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: step.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 3,
                  mb: 2,
                  border: '2.5px solid #a5d6a7',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.08)' }
                }}
              >
                {step.icon}
              </Box>
              <Typography fontWeight={700} color="#388e3c" sx={{ mb: 1 }}>
                {step.label}
              </Typography>
              <Typography color="text.secondary" fontSize={15} sx={{ textAlign: 'center', maxWidth: 180 }}>
                {step.desc}
              </Typography>
              {/* Connecting line (except last step) */}
              {idx < arr.length - 1 && (
                <Box
                  sx={{
                    position: { xs: 'absolute', md: 'absolute' },
                    top: { xs: 90, md: 40 },
                    left: { xs: 39, md: '100%' },
                    width: { xs: 2, md: 80 },
                    height: { xs: 40, md: 2 },
                    bgcolor: '#a5d6a7',
                    mx: { md: 2 },
                    my: { xs: 1, md: 0 }
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Container>

      {/* Animated Statistics */}
      <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Paper elevation={4} sx={{
                p: 4,
                borderRadius: 4,
                textAlign: 'center',
                background: 'linear-gradient(120deg, #e8f5e9 60%, #b2dfdb 100%)',
                border: '1.5px solid #a5d6a7'
              }}>
                <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                <Typography variant="h4" fontWeight={900} color="#388e3c">
                  {/* Simple animation */}
                  <span>{stat.value.toLocaleString()}</span>
                </Typography>
                <Typography color="text.secondary" fontWeight={700}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section with fixed background */}
      <Box
        sx={{
          py: 8,
          background: `linear-gradient(rgba(56,142,60,0.6),rgba(56,142,60,0.6)), url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat`,
          backgroundAttachment: 'fixed'
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
          <Typography variant="h4" fontWeight={800} color="#388e3c" align="center" gutterBottom>
            What Our Users Say
        </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'row' },
              overflowX: { xs: 'auto', md: 'visible' },
              gap: 3,
              py: 2,
              px: 1,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              justifyContent: 'center'
            }}
          >
            {[
              {
                name: "Ravi Kumar",
                role: "Organic Farmer",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                feedback: "AgriChain made certification and traceability so easy. My buyers trust me more now!"
              },
              {
                name: "Sita Devi",
                role: "Supply Chain Manager",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                feedback: "The analytics and transparency features are a game changer for our cooperative."
              },
              {
                name: "Dr. John Smith",
                role: "Agri Inspector",
                avatar: "https://randomuser.me/api/portraits/men/65.jpg",
                feedback: "I can verify and audit organic claims in minutes, not days. Highly recommended!"
              }
            ].map((testimonial, idx) => (
              <Paper
                key={idx}
                elevation={6}
                sx={{
                  minWidth: 260,
                  maxWidth: 280,
                  p: 3,
                  borderRadius: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(120deg, #fffde7 60%, #e8f5e9 100%)',
                  border: '1.5px solid #a5d6a7',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: 10 }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #43a047' }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                  "{testimonial.feedback}"
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} color="success.main">
                  {testimonial.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {testimonial.role}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Our Partners Section with animated marquee and supply chain background */}
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          py: 8,
          position: 'relative',
          background: `
            linear-gradient(120deg, #e0f7fa 60%, #fffde7 100%),
            url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='1' width='78' height='78' rx='16' fill='%23ffffff' fill-opacity='0.07' stroke='%23a5d6a7' stroke-width='2'/%3E%3Ccircle cx='40' cy='40' r='8' fill='%23a5d6a7' fill-opacity='0.09'/%3E%3C/svg%3E")
          `,
          backgroundRepeat: 'repeat',
          overflow: 'hidden'
        }}
      >
        <Typography variant="h4" fontWeight={800} color="#388e3c" align="center" gutterBottom>
          Our Partners
        </Typography>
        <Box
          sx={{
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            mt: 4,
            pb: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              animation: 'marquee 18s linear infinite',
              '@keyframes marquee': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' }
              }
            }}
          >
            {/* Repeat the logos twice for seamless looping */}
            {[
              { name: "GreenLeaf", logo: "https://img.icons8.com/color/96/000000/leaf.png" },
              { name: "FarmTrust", logo: "https://img.icons8.com/color/96/000000/tractor.png" },
              { name: "BioCert", logo: "https://img.icons8.com/color/96/000000/organic-food.png" },
              { name: "AgroChain", logo: "https://img.icons8.com/color/96/000000/wheat.png" },
              { name: "EcoMarket", logo: "https://img.icons8.com/color/96/000000/market-square.png" }
            ].concat([
              { name: "GreenLeaf", logo: "https://img.icons8.com/color/96/000000/leaf.png" },
              { name: "FarmTrust", logo: "https://img.icons8.com/color/96/000000/tractor.png" },
              { name: "BioCert", logo: "https://img.icons8.com/color/96/000000/organic-food.png" },
              { name: "AgroChain", logo: "https://img.icons8.com/color/96/000000/wheat.png" },
              { name: "EcoMarket", logo: "https://img.icons8.com/color/96/000000/market-square.png" }
            ]).map((partner, idx) => (
              <Paper
                key={idx}
                elevation={4}
                sx={{
                  minWidth: 140,
                  maxWidth: 160,
                  p: 2,
                  borderRadius: 3,
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.85)',
                  border: '1.5px solid #a5d6a7',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'scale(1.08)', boxShadow: 10 }
                }}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  style={{ width: 56, height: 56, marginBottom: 8 }}
                />
                <Typography variant="subtitle1" fontWeight={700} color="success.main">
                  {partner.name}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Container>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="#388e3c" align="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        {faqs.map((faq, idx) => (
          <Accordion key={idx} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={700}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      {/* Newsletter/Contact Section */}
      <Container maxWidth="sm" sx={{ mt: 10, mb: 10 }}>
        <Paper elevation={8} sx={{
          p: 5,
          borderRadius: 4,
          textAlign: 'center',
          background: 'linear-gradient(120deg, #e0f7fa 60%, #fffde7 100%)',
          border: '1.5px solid #a5d6a7'
        }}>
          <Typography variant="h4" fontWeight={800} color="#388e3c" gutterBottom>
            Stay Connected
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Subscribe to our newsletter for updates, tips, and more!
          </Typography>
          <Box
            component="form"
            onSubmit={e => {
              e.preventDefault();
              alert('Thank you for subscribing!');
            }}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <TextField
              label="Your Email"
              type="email"
              required
              sx={{ mb: 2, width: '100%' }}
            />
            <Button type="submit" variant="contained" color="success" size="large">
              Subscribe
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 2,
          textAlign: 'center',
          color: '#fff',
          // mt: 'auto',
          background: `linear-gradient(90deg, #388e3c 0%, #263238 100%), url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='1' width='78' height='78' rx='16' fill='%23ffffff' fill-opacity='0.07' stroke='%23a5d6a7' stroke-width='2'/%3E%3Ccircle cx='40' cy='40' r='8' fill='%23a5d6a7' fill-opacity='0.09'/%3E%3C/svg%3E")`
        }}
      >
        <Typography  sx={{ letterSpacing: 1 }}>
          © {new Date().getFullYear()} AgriChain. Gujarat Organic Products Certification Agency (GOPCA).
        </Typography>
        {/* <Box sx={{ mt: 1 }}>
          <IconButton href="#" sx={{ color: '#fff' }}><i className="fab fa-twitter"></i></IconButton>
          <IconButton href="#" sx={{ color: '#fff' }}><i className="fab fa-linkedin"></i></IconButton>
          <IconButton href="#" sx={{ color: '#fff' }}><i className="fab fa-facebook"></i></IconButton>
        </Box> */}
      </Box>

      {/* Chatbot Floating Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300
        }}
      >
        <Fade in={!chatOpen}>
          <IconButton
            color="success"
            size="large"
            sx={{
              bgcolor: 'white',
              boxShadow: 3,
              '&:hover': { bgcolor: 'success.light' }
            }}
            onClick={() => setChatOpen(true)}
          >
            <ChatIcon fontSize="large" />
          </IconButton>
        </Fade>
        <Slide direction="up" in={chatOpen} mountOnEnter unmountOnExit>
          <Paper
            elevation={8}
            sx={{
              width: isMobile ? 320 : 400,
              height: 420,
              position: 'relative',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 4,
              border: '2px solid #a5d6a7'
            }}
          >
            <Box sx={{ flex: 1, overflowY: 'auto', mb: 1 }}>
              {chatMessages.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.from === 'bot' ? 'flex-start' : 'flex-end',
                    mb: 1
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: msg.from === 'bot' ? 'success.light' : 'primary.light',
                      color: msg.from === 'bot' ? 'success.contrastText' : 'primary.contrastText',
                      maxWidth: '80%'
                    }}
                  >
                    {msg.text}
                  </Paper>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    handleSend();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color="primary"
                        disabled={!chatInput.trim()}
                        onClick={handleSend}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => setChatOpen(false)}
                color="error"
              >
                <CloseIcon />
              </IconButton>
        </Box>
      </Paper>
        </Slide>
      </Box>
    </Box>
  );
}
