package com.ctecx.argosfims.tenant.systemsetup;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "settings")
public class AppSetup {

    @Id
    @Column(name = "`key`", nullable = false, length = 128)
    private String key;

    @Column(nullable = false, length = 1024)
    private String value;

    @Enumerated(EnumType.STRING)
    @Column(name = "setup_category", nullable = false, length = 45)
    private SetupCategory setupCategory;

    public AppSetup(String key) {
        this.key = key;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AppSetup)) return false;
        AppSetup appSetup = (AppSetup) o;
        return getKey().equals(appSetup.getKey());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getKey());
    }

    @Override
    public String toString() {
        return "AppSetup{" +
                "key='" + key + '\'' +
                ", value='" + value + '\'' +
                ", setupCategory=" + setupCategory +
                '}';
    }
}