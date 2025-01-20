package com.ctecx.argosfims.tenant.mpesa;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mpesa/config")
@RequiredArgsConstructor
public class MpesaConfigController {
    private final MpesaConfigService mpesaConfigService;

    @GetMapping
    public ResponseEntity<List<MpesaConfigEntity>> getAllConfigurations(){
        return new ResponseEntity<>(mpesaConfigService.getAllConfigurations(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MpesaConfigEntity> getConfigurationById(@PathVariable Long id){
        return new ResponseEntity<>(mpesaConfigService.getConfigurationById(id),HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<MpesaConfigEntity> createConfiguration(@RequestBody MpesaConfigEntity mpesaConfigEntity){
        return new ResponseEntity<>(mpesaConfigService.createConfiguration(mpesaConfigEntity),HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public  ResponseEntity<MpesaConfigEntity> updateConfiguration(@PathVariable Long id , @RequestBody MpesaConfigEntity mpesaConfigEntity){
        return new ResponseEntity<>(mpesaConfigService.updateConfiguration(id,mpesaConfigEntity),HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConfiguration(@PathVariable Long id){
        mpesaConfigService.deleteConfiguration(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}