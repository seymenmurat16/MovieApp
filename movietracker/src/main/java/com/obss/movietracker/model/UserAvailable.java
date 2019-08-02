package com.obss.movietracker.model;

public class UserAvailable {
    private Boolean available;

    public UserAvailable (Boolean available) {
        this.available = available;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}
