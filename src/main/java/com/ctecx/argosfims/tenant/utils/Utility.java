package com.ctecx.argosfims.tenant.utils;




import com.ctecx.argosfims.tenant.systemsetup.EmailSetting;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.util.Properties;


public class Utility {

    public static String getSiteUrl(HttpServletRequest request) {
        String siteUrl = request.getRequestURL().toString();
        return siteUrl.replace(request.getServletPath(), "");
    }

    public static JavaMailSenderImpl prepareMailSender(EmailSetting emailSetting) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(emailSetting.getHost());
        mailSender.setPassword(emailSetting.getPassword());
        mailSender.setPort(emailSetting.getPortNumber());
        mailSender.setUsername(emailSetting.getUserName());

        Properties props = new Properties();
        props.setProperty("mail.smtp.auth", emailSetting.getSmtpAuth());
        props.setProperty("mail.smtp.starttls.enable", emailSetting.getSmtpSecure());
        mailSender.setJavaMailProperties(props);

        return mailSender;
    }

    public static EmailResult sendEmail(JavaMailSenderImpl mailSender, String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            return new EmailResult(true, "Email sent successfully");
        } catch (MailException e) {
            return new EmailResult(false, "Failed to send email: " + e.getMessage());
        }
    }

    public static EmailResult sendHtmlEmail(JavaMailSenderImpl mailSender, String toEmail, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            return new EmailResult(true, "HTML email sent successfully");
        } catch (MailException | MessagingException e) {
            return new EmailResult(false, "Failed to send HTML email: " + e.getMessage());
        }
    }
}