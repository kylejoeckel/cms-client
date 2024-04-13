import React, { useEffect, useState } from "react";
import ContentCard from "../../components/ContentCard";
import { Button, Card, Grid, Typography } from "@mui/material";
import FileUploader from "../../components/FileUploader";
import BasicInfoForm from "../../components/BasicInfoForm";
import { jwtDecode } from 'jwt-decode';

export interface CTA {
  cta: string;
  ctaLink: string;
  ctaDownload: boolean;
}

export interface ContentItem {
  [key: string]: any; // Adding an index signature
  title: string;
  content: string;
  contentImg: string;
  ctaList: CTA[];
}

export interface FormData {
  fullName: string;
  hours: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  domainName: string;
  contactEmail: string;
  reservationLink: string;
  takeoutLink: string;
  noveltyLink: string;
  mainLogo: string;
  navLogo: string;
  heroImg: string;
  heroVideo: string;
  heroVideoPoster: string;
  menuRoute: string;
  content: ContentItem[];
}

const RestaurantForm = () => {
  const token = localStorage.getItem("auth-token");
  const decoded = jwtDecode(token || '');
  const organizationId = (decoded as { organization_id?: string }).organization_id || '';
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    hours: "",
    address: "",
    phone: "",
    latitude: 0,
    longitude: 0,
    domainName: "",
    contactEmail: "",
    reservationLink: "",
    takeoutLink: "",
    noveltyLink: "",
    mainLogo: "",
    navLogo: "",
    heroImg: "",
    heroVideo: "",
    heroVideoPoster: "",
    menuRoute: "",
    content: [
      {
        title: "",
        content: "",
        contentImg: "",
        ctaList: [{ cta: "", ctaLink: "", ctaDownload: false }],
      },
    ],
  });

  useEffect(() => {
    console.log(process.env.REACT_APP_SITE_DATA_URL, "URL");
    const fetchData = async () => {
      const response = await (
        await fetch(
          process.env.REACT_APP_SITE_DATA_URL +
          `/${organizationId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
          }
        )
      ).json();
      setFormData(response?.siteData);
    };
    fetchData();
    console.log("formData");
  }, []);


  const saveFormData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SITE_DATA_URL}/${organizationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ siteData: formData }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save data");
      }
      const result = await response.json();
      console.log("Data saved successfully:", result);
      // Optional: Show a success message or perform further actions
    } catch (error) {
      console.error("Error saving data:", error);
      // Optional: Show an error message
    }
  };


  const updateContentItem = <K extends keyof ContentItem, L extends keyof CTA>(
    index: number,
    parameterName: K | L,
    value: ContentItem[K] | CTA[L],
    ctaIndex?: number // Optional parameter to specify the index of the ctaItem to update
  ): void => {
    setFormData((prevFormData: FormData) => ({
      ...prevFormData, // Spread the previous formData to keep existing fields
      content: prevFormData.content.map(
        (contentItem, idx) =>
          idx === index // Check if this is the target content item
            ? ctaIndex !== undefined && parameterName in contentItem.ctaList[0] // Check if updating a ctaItem
              ? {
                ...contentItem,
                ctaList: contentItem.ctaList.map(
                  (ctaItem, ctaIdx) =>
                    ctaIdx === ctaIndex
                      ? { ...ctaItem, [parameterName]: value } // Update the specified cta parameter
                      : ctaItem // Leave other ctaItems unchanged
                ),
              }
              : { ...contentItem, [parameterName]: value } // Update the specified content parameter
            : contentItem // Leave other content items unchanged
      ),
    }));
  };

  const setMenuRoute = (file: string, index: number) => {
    setFormData({ ...formData, menuRoute: file });
  };

  return (
    <>
      <Card
        sx={{
          border: "solid 1px lightgrey",
          padding: "1rem",
          margin: "1rem",
          borderRadius: "1rem",
        }}
      >
        <Typography variant="h5">Asset Upload</Typography>
        <Card sx={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
          <FileUploader />
        </Card>
      </Card>
      <BasicInfoForm formData={formData} setFormData={setFormData} setMenuRoute={setMenuRoute} />
      <Card
        sx={{
          border: "solid 1px lightgrey",
          padding: "1rem",
          margin: "1rem",
          borderRadius: "1rem",
        }}
      >
        <Typography variant="h5">Content Section Editor</Typography>

        <Grid container spacing={2}>
          {formData.content.map((content, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <ContentCard
                contentData={content}
                updateData={updateContentItem}
                index={index}
              />
            </Grid>
          ))}
        </Grid>
      </Card>
      <Button
        variant="contained"
        color="primary"
        onClick={saveFormData}
        sx={{ margin: "1rem 0" }}
      >
        Save Changes
      </Button>
    </>
  );
};

export default RestaurantForm;
