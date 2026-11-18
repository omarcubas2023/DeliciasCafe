package backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class PaymentConfigController {

    @Value("${app.yape.phone:}")
    private String yapePhone;

    @GetMapping("/pagos")
    public Map<String, String> getPaymentConfig() {
        return Map.of("yapePhone", yapePhone);
    }
}
