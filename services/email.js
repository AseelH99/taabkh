import nodemailer from "nodemailer";
export async function sendEmail(to,subject,html){
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "aseelh355@gmail.com",
    pass: "ppzo hfwg xmgz mnkr",
  },
});
  const info = await transporter.sendMail({
    from: `"Fred Foo 👻" <aseelh355@gmail.com>`, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });
 
}
