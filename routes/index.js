const express = require("express");
const axios = require("axios");
const https = require("https");

const router = express.Router();

let getCampaignsList = async () => {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  let { data } = await axios.get(`${process.env.API_BASE_URL}/campaign`, {
    httpsAgent: agent,
  });
  return data;
};

router.get("/campaigns", async (req, res) => {
  try {
    let campaignsListFromAPI = await getCampaignsList();
    let campaignsList = campaignsListFromAPI
      .sort((a, b) => {
        return b.totalAmount - a.totalAmount;
      })
      .map((campaign) => {
        return {
          title: campaign.title,
          totalAmount: campaign.totalAmount,
          backersCount: campaign.backersCount,
          endDate: campaign.endDate,
        };
      });
    res.status(200).send(campaignsList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error", errorStack: error });
  }
});

router.get("/activeCampaigns", async (req, res) => {
  try {
    let campaignsListFromAPI = await getCampaignsList();
    var today = new Date();
    var previousDate = new Date().setDate(today.getDate() - 30);
    let campaignsList = campaignsListFromAPI.filter((campaign) => {
      if (
        new Date(campaign.endDate) >= today &&
        new Date(previousDate) <= new Date(campaign.created)
      ) {
        return true;
      }
    });
    res.status(200).send(campaignsList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error", errorStack: error });
  }
});

router.get("/closedCampaigns", async (req, res) => {
  try {
    let campaignsListFromAPI = await getCampaignsList();
    var today = new Date();
    let campaignsList = campaignsListFromAPI.filter((campaign) => {
      if (
        new Date(campaign.endDate) <= today ||
        campaign.procuredAmount >= campaign.totalAmount
      ) {
        return true;
      }
    });
    res.status(200).send(campaignsList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error", errorStack: error });
  }
});

module.exports = router;
