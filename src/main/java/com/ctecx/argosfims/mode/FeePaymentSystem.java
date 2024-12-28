package com.ctecx.argosfims.mode;

import java.util.ArrayList;
import java.util.List;

public class FeePaymentSystem {
    public static void main(String[] args) {
        // 1. Define Voteheads
        List<Votehead> voteheads = new ArrayList<>();
        voteheads.add(new Votehead("Tuition", 4000));
        voteheads.add(new Votehead("Exam", 1000));
        voteheads.add(new Votehead("Activity", 2000));

        // 2. Payment Details
        int totalFees = 7000;
        int amountPaid = 15000;
        int remainingPayment = amountPaid;

        System.out.println("Initial Payment: " + amountPaid);
        System.out.println("Initial Remaining Payment: " + remainingPayment);

        // 3. Distribute Payment
        for (Votehead votehead : voteheads) {
            System.out.println("\nProcessing votehead: " + votehead.name);
            int remainingCost = votehead.getRemainingCost();
            System.out.println("   Remaining cost for " + votehead.name + ": " + remainingCost);

            if (remainingPayment > 0) {
                int payment = Math.min(remainingPayment, remainingCost);
                System.out.println("   Payment Allocated: " + payment + " to " + votehead.name);
                votehead.makePayment(payment);
                remainingPayment -= payment;
                System.out.println("   Remaining payment after allocation: " + remainingPayment);

            }
            else{
                System.out.println("   No remaining payment to allocate to  " + votehead.name);
            }


        }

        // 4. Print Results
        System.out.println("\nPayment Distribution:");
        for (Votehead votehead : voteheads) {
            System.out.println(votehead.toString());
        }
        System.out.println("\nRemaining Payment: " + remainingPayment);
    }
}