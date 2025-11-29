package org.mentoria.dto.request;

public class ChangePasswordDTO {
    private String currentPassword;
    private String newPassword;

    // Construtor padrão (OBRIGATÓRIO para JSON deserialization)
    public ChangePasswordDTO() {}

    // Construtor com parâmetros
    public ChangePasswordDTO(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    // Getters e Setters
    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    @Override
    public String toString() {
        return "ChangePasswordDTO{" +
                "currentPassword='" + (currentPassword != null ? "***" : "null") + '\'' +
                ", newPassword='" + (newPassword != null ? "***" : "null") + '\'' +
                '}';
    }
}