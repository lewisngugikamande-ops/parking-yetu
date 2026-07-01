# Parking Yetu - Deployment Guide

## Local Development
npm install
npm run dev

## Build for Production
npm run build

## Deploy to Firebase
npx firebase deploy --only firestore:rules
npx firebase deploy --only firestore:indexes
npx firebase deploy --only hosting

---

*Parking Yetu - Deployment Guide - Version 3.1.0*
