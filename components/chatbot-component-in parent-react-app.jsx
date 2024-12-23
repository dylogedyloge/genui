import React, { useState, useEffect } from "react";
import { Fab, Box, useTheme, useMediaQuery } from "@mui/material";
import logo1 from "../../../assets/imgs/logo1.png";

const Chatbot = () => {
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotVisible((prev) => !prev);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is small (mobile)

  useEffect(() => {
    const handlePostMessage = (event) => {
      if (event.origin !== "https://genui-roan.vercel.app") return;

      const { type, payload } = event.data;
      if (type === "SELECTED_FLIGHT") {
        sessionStorage.setItem("selectedDepartureFlight", JSON.stringify(payload.selectedDepartureFlight));
        sessionStorage.setItem("generalInformation", JSON.stringify(payload.generalInformation));
        sessionStorage.setItem("ticketInformation", JSON.stringify(payload.ticketInformation));
        window.location.href = "/fa/flight-passengers";
      }
    };

    window.addEventListener("message", handlePostMessage);

    return () => {
      window.removeEventListener("message", handlePostMessage);
    };
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="default"
        aria-label="chat"
        onClick={toggleChatbot}
        sx={{
          height: 40,
          width: 40,
          position: "fixed",
          bottom: 85,
          right: 16,
          zIndex: 1500,
        }}
      >
        <img src={logo1} alt="chatbot" height={25} width={20} />
      </Fab>
      {/* Chatbot iframe */}
      {isChatbotVisible && (
        <Box
          sx={{
            position: "fixed",
            bottom: 140, // Adjust for mobile devices
            right: 16,
            width: isMobile ? "90%" : 400, // Responsive width
            height: isMobile ? "60%" : 500, // Responsive height
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
            zIndex: 1400,
          }}
        >
          <iframe
            src="https://genui-roan.vercel.app/"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            title="Chatbot"
            allow="microphone"
          ></iframe>
        </Box>
      )}
    </>
  );
};

export default Chatbot;

