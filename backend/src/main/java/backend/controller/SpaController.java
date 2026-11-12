package backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({"/", "/{path:[^\\.]*}"})
    public String forwardToApplication() {
        return "forward:/index.html";
    }
}
