package ke.kigen.api.configs.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import ke.kigen.api.configs.properties.admin.AdminConfig;
import ke.kigen.api.configs.properties.contact.ContactConfig;
import ke.kigen.api.configs.properties.logging.LoggingConfig;
import ke.kigen.api.configs.properties.payment_channel.PaymentChannelConfig;
import ke.kigen.api.configs.properties.role.RoleConfig;
import ke.kigen.api.configs.properties.sale.SaleConfig;
import ke.kigen.api.configs.properties.security.SecurityConfig;
import ke.kigen.api.configs.properties.status.StatusConfig;
import ke.kigen.api.configs.properties.transaction.TransactionConfig;
import ke.kigen.api.configs.properties.user.UserConfig;
import lombok.Data;

@Component
@ConfigurationProperties(prefix = "main")
@Data
public class MainConfig {

    private AdminConfig admin;

    private ContactConfig contact;

    private LoggingConfig logging;

    private PaymentChannelConfig paymentChannel;

    private RoleConfig role;

    private SaleConfig sale;

    private SecurityConfig security;
    
    private StatusConfig status;

    private TransactionConfig transaction;

    private UserConfig user;

    public MainConfig() {
        setAdmin(new AdminConfig());
        setContact(new ContactConfig());
        setLogging(new LoggingConfig());
        setPaymentChannel(new PaymentChannelConfig());
        setRole(new RoleConfig());
        setSale(new SaleConfig());
        setSecurity(new SecurityConfig());
        setStatus(new StatusConfig());
        setTransaction(new TransactionConfig());
        setUser(new UserConfig());
    }
}
