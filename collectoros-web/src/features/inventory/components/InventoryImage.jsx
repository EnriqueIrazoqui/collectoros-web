import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { getInventoryImageBlob } from "../api/inventoryApi";

const InventoryImage = ({ imageId, alt, sx = {} }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl = null;
    let isMounted = true;

    const loadImage = async () => {
      try {
        setLoading(true);

        const blob = await getInventoryImageBlob(imageId);
        objectUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setImageSrc(objectUrl);
        }
      } catch (error) {
        console.error("Error loading inventory image:", error);

        if (isMounted) {
          setImageSrc("");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (imageId) {
      loadImage();
    }

    return () => {
      isMounted = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageId]);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.50",
          ...sx,
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!imageSrc) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
          color: "text.secondary",
          fontSize: 14,
          ...sx,
        }}
      >
        No image
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={imageSrc}
      alt={alt}
      sx={{
        width: "100%",
        height: 180,
        objectFit: "cover",
        display: "block",
        ...sx,
      }}
    />
  );
};

export default InventoryImage;