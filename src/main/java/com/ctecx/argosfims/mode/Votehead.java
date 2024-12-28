package com.ctecx.argosfims.mode;



class Votehead {
    String name;
    int cost;
    int amountPaid;

    public Votehead(String name, int cost) {
        this.name = name;
        this.cost = cost;
        this.amountPaid = 0; // Initialize to zero
    }

    public int getRemainingCost() {
        return cost - amountPaid;
    }

    public void makePayment(int payment) {
        this.amountPaid += payment;
    }

    @Override
    public String toString() {
        return "Votehead [name=" + name + ", cost=" + cost + ", amountPaid=" + amountPaid + "]";
    }
}