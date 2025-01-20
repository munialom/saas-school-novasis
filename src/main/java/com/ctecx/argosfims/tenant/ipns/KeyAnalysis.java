package com.ctecx.argosfims.tenant.ipns;

import java.util.Base64;

public class KeyAnalysis {
    public static void main(String[] args) {
        // Public Key
        String PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7Sv51YgaKxYYjaxMdkuo"
                + "qFNKBM6E8EzZxwQF4sjhkRvuHtmPsS5p+tHAwH4oZzdgFj3SIa16WASKOa+dXPae"
                + "MWiimJg8pe76ReYdFOmvVxx2zu3HaXHWKyEbT9oFjLFc2teLbb6IX0IwDM3WOYcT"
                + "2fGYdy+LB6xE+zngVFXdWRokGYl3zcv0i6svI9SAFFzzpSaITjnH8zkje2aVQ2XK"
                + "AxdwTg86i9CDRbrkrkvgZqqu6mmYsC5/DwpB7H1nWMKXKsBorZlp1tY4GNhsiN5A"
                + "Dp695cFYGrolkh4tbyLlBm7Vk9dGDN78OaGx2tmA9UySeqMZ9VmSIJK1qrLSmGUa"
                + "OQIDAQAB";

        String signature1 = "gOTn5RMWlBe+vhZP71dfFnxzs56vgOT6wD7dSvaPx4Flxsz1EPsx6iMF0BPk8G8UcGYwVD08/ymQ44qGuItiw8TfPu16gMJ84D0b0EQ4GAfHAkOK3gVPxWA45qa5ztxPk5yJaAMOr9nkB1Pz8o4kiUda+KjqKGG5mQmmXJ62MdA=";
        String signature2 = "a8AeCyCsUa+ui81UxW7O/a21BKp5rX6dgw9a+AKrgCm/mGj5qRz+Jlk99gaSzqad/w6FaJVa7KqDhofj+oOfacDehMuC0puEH9JATgQBYOLwoJRayYIB4qtIZ5txofpTvJnYL8hFJT3Og9W7oNlhqUsfKiNs/zU8a+/jpYGcEFg=";

        // Decode and analyze
        byte[] keyBytes = Base64.getDecoder().decode(PUBLIC_KEY);
        byte[] sig1Bytes = Base64.getDecoder().decode(signature1);
        byte[] sig2Bytes = Base64.getDecoder().decode(signature2);

        System.out.println("Public Key Length: " + keyBytes.length + " bytes");
        System.out.println("Signature 1 Length: " + sig1Bytes.length + " bytes");
        System.out.println("Signature 2 Length: " + sig2Bytes.length + " bytes");
    }
}