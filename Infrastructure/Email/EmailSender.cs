using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.Email
{
    public class EmailSender
    {
        private readonly IConfiguration _config;
        public EmailSender(IConfiguration config)
        {
            _config = config;
        }

        public async Task<bool> SendEmailAsync(string userEmail, string emailSubject, string msg)
        {
            var key = _config["Sendgrid:Key"];
            var user = _config["Sendgrid:User"];

            var client = new SendGridClient(_config["Sendgrid:Key"]);
            var message = new SendGridMessage
            {
                From = new EmailAddress("lastingyeh@outlook.com", _config["Sendgrid:User"]),
                Subject = emailSubject,
                PlainTextContent = msg,
                HtmlContent = msg,
            };

            message.AddTo(new EmailAddress(userEmail));
            message.SetClickTracking(false, false);

            var res = await client.SendEmailAsync(message);

            if(res.IsSuccessStatusCode){
                return true;
            }
            return false;
        }
    }
}