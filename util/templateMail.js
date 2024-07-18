const { MailtrapClient } = require("mailtrap");

const sendEmail = () => {
    const TOKEN = "53a28d53b22b71b4b3fbccb8c5884af3";
    const ENDPOINT = "https://sandbox.api.mailtrap.io/";
    
    const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });
    
    const sender = {
      email: "mailtrap@demomailtrap.com",
      name: "Mailtrap Test",
    };
    const recipients = [
      {
        email: "hellruler80@gmail.com",
      }
    ];
    
    client
      .send({
        from: sender,
        to: recipients,
        template_uuid: "a920cb4c-b155-43f8-b888-c41b98701475",
        template_variables: {
          "company_info_name": "Agni Dental",
          "company_info_address": "Pulchowk Lalitpur",
          "company_info_city": "Lalitpur",
          "company_info_zip_code": "44700",
          "company_info_country": "Nepal"
        }
      })
      .then(console.log, console.error);
}

module.exports = sendEmail;
