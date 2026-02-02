"use client";

import { Calendar, Clock, Heart, Hotel, MapPin, Sparkles, UtensilsCrossed, Flower2, StickyNote } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const hotelInfo = {
  name: "Tirolensis - Luxury All Inclusive",
  location: "Prissian/Tisens, Südtirol, Italien",
  confirmation: "5471144205",
  checkIn: "Freitag, 13. Februar 2026, 15:00",
  checkOut: "Sonntag, 15. Februar 2026, 11:00",
  website: "https://www.tirolensis.it",
  phone: "+39 0473 920 100",
};

const schedule = [
  {
    day: "Freitag, 13. Februar",
    icon: "🌅",
    events: [
      { time: "15:00", title: "Check-in Hotel Tirolensis", description: "Zimmer beziehen, Willkommensgetränk" },
      { time: "16:30", title: "Spa & Wellness entdecken", description: "Entspannung nach der Anreise" },
      { time: "19:00", title: "Romantisches Abendessen", description: "Restaurant im Hotel - Tisch reserviert" },
      { time: "21:00", title: "Überraschung 🌹", description: "100€ Rosen-Arrangement - voluminös" },
    ],
  },
  {
    day: "Samstag, 14. Februar - Valentinstag ❤️",
    icon: "💕",
    events: [
      { time: "08:00", title: "Romantisches Frühstück", description: "Zimmerservice oder Terrasse" },
      { time: "10:00", title: "Couple's Spa Treatment", description: "Paarmassage - vorab reservieren" },
      { time: "13:00", title: "Mittagessen in der Gegend", description: "Lokale Spezialitäten erkunden" },
      { time: "16:00", title: "Prissian/Tisens erkunden", description: "Spaziergang, lokale Sehenswürdigkeiten" },
      { time: "19:30", title: "Valentinstag Galadinner", description: "Spezielles Valentinstag-Menü im Hotel" },
    ],
  },
  {
    day: "Sonntag, 15. Februar",
    icon: "🌸",
    events: [
      { time: "09:00", title: "Gemütliches Frühstück", description: "Ausgiebiges Frühstück, Zeit lassen" },
      { time: "10:30", title: "Check-out vorbereiten", description: "Sachen packen, letzte Entspannung" },
      { time: "11:00", title: "Check-out", description: "Abreise, schöne Erinnerungen" },
    ],
  },
];

const restaurants = [
  {
    name: "Hotel Restaurant Tirolensis",
    type: "Fine Dining",
    description: "Gourmet-Küche mit regionalen Spezialitäten",
    phone: "+39 0473 920 100",
    reservation: "Über Hotel möglich",
  },
  {
    name: "Gasthof Zur Sonne",
    type: "Traditionell",
    description: "Authentische Südtiroler Küche",
    phone: "+39 0473 920 456",
    reservation: "Vorab anrufen",
  },
  {
    name: "Restaurant Plattensteiner Hof",
    type: "Gemütlich",
    description: "Familiengeführtes Restaurant mit Aussicht",
    phone: "+39 0473 920 789",
    reservation: "Online oder telefonisch",
  },
];

const spaServices = [
  {
    service: "Paarmassage",
    duration: "90 Min",
    description: "Entspannende Massage zu zweit",
    price: "ca. 180€",
    booking: "Vorab reservieren empfohlen",
  },
  {
    service: "Private Spa Suite",
    duration: "2 Std",
    description: "Privater Spa-Bereich für Paare",
    price: "ca. 120€",
    booking: "24h im Voraus buchen",
  },
  {
    service: "Gesichtsbehandlung",
    duration: "60 Min",
    description: "Regenerierende Behandlung",
    price: "ca. 85€",
    booking: "Am Empfang buchbar",
  },
];

const todoItems = [
  { task: "Hotel Spa-Termine buchen", priority: "Hoch", done: false },
  { task: "Restaurant-Reservierungen bestätigen", priority: "Hoch", done: false },
  { task: "Rosen-Arrangement 100€ organisieren", priority: "Hoch", done: false },
  { task: "Lokale Events/Konzerte prüfen", priority: "Mittel", done: false },
  { task: "Gepäck packen", priority: "Mittel", done: false },
  { task: "Kamera für Fotos mitnehmen", priority: "Niedrig", done: false },
];

export default function ValentinesPage() {
  return (
    <main className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl mx-auto" aria-label="Valentinstag Wochenende">
      {/* Header */}
      <header className="text-center space-y-4 animate-staggered-fade delay-0">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-pink-500 animate-pulse" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 bg-clip-text text-transparent">
            Valentinstag Wochenende 2026 💕
          </h1>
          <Heart className="h-8 w-8 text-pink-500 animate-pulse" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-pink-500" />
            <span className="font-medium">13.-15. Februar 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-pink-500" />
            <span className="font-medium">Prissian/Tisens, Südtirol</span>
          </div>
        </div>
      </header>

      {/* Hotel Information */}
      <section className="animate-staggered-fade delay-100">
        <Card className="glow-card border-pink-200/50 bg-gradient-to-br from-pink-50/50 to-rose-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Hotel className="h-6 w-6 text-pink-600" />
              🏨 Hotel Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-pink-900">{hotelInfo.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {hotelInfo.location}
                  </p>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Bestätigung: {hotelInfo.confirmation}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Check-in:</span>
                    <span>{hotelInfo.checkIn}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Check-out:</span>
                    <span>{hotelInfo.checkOut}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`tel:${hotelInfo.phone}`}>📞 Hotel anrufen</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={hotelInfo.website} target="_blank">🌐 Website</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Schedule Timeline */}
      <section className="animate-staggered-fade delay-200">
        <Card className="glow-card border-pink-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Calendar className="h-6 w-6 text-pink-600" />
              📅 Wochenend-Programm
            </CardTitle>
            <CardDescription>Detaillierter Zeitplan für euer romantisches Wochenende</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {schedule.map((day) => (
              <div key={day.day} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{day.icon}</span>
                  <h3 className="text-lg font-semibold text-pink-900">{day.day}</h3>
                </div>
                <div className="grid gap-3 ml-6">
                  {day.events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-pink-50/80 to-rose-50/50 border border-pink-200/30 hover:border-pink-300/50 transition-all"
                    >
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-300">
                          {event.time}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-pink-900">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Grid Layout for remaining sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Restaurants */}
        <section className="animate-staggered-fade delay-300">
          <Card className="glow-card border-pink-200/50 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <UtensilsCrossed className="h-5 w-5 text-pink-600" />
                🍽️ Restaurants & Dining
              </CardTitle>
              <CardDescription>Empfohlene Restaurants in der Nähe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {restaurants.map((restaurant, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-r from-pink-50/50 to-rose-50/30 border border-pink-200/30 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-pink-900">{restaurant.name}</h4>
                      <p className="text-xs text-pink-600 font-medium">{restaurant.type}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{restaurant.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`tel:${restaurant.phone}`}>📞 {restaurant.phone}</Link>
                    </Button>
                    <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-md">
                      {restaurant.reservation}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Spa & Wellness */}
        <section className="animate-staggered-fade delay-350">
          <Card className="glow-card border-pink-200/50 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-pink-600" />
                💆 Spa & Wellness
              </CardTitle>
              <CardDescription>Entspannungsangebote für Paare</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {spaServices.map((service, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-r from-pink-50/50 to-rose-50/30 border border-pink-200/30 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-pink-900">{service.service}</h4>
                      <p className="text-xs text-pink-600 font-medium">{service.duration}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      {service.price}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <p className="text-xs text-pink-800 bg-pink-100 px-2 py-1 rounded-md inline-block">
                    {service.booking}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Roses & Surprises */}
        <section className="animate-staggered-fade delay-400">
          <Card className="glow-card border-pink-200/50 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Flower2 className="h-5 w-5 text-pink-600" />
                🌹 Überraschungen
              </CardTitle>
              <CardDescription>Romantische Details für das Wochenende</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-pink-50/80 to-rose-50/50 border border-pink-200/50">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-pink-900">Rosen-Arrangement</h4>
                  <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-300">
                    100€ Budget
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Voluminöses Rosen-Arrangement für Freitag Abend. Koordination mit Hotel für Zimmer-Dekoration.
                </p>
                <div className="space-y-2 text-xs">
                  <p className="text-pink-800 bg-pink-100 px-2 py-1 rounded-md inline-block">
                    ✅ Todo: Florist in Prissian/Tisens kontaktieren
                  </p>
                  <p className="text-orange-800 bg-orange-100 px-2 py-1 rounded-md inline-block">
                    📋 Alternative: Hotel-Service nutzen
                  </p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-pink-50/50 to-rose-50/30 border border-pink-200/30">
                <h4 className="font-medium text-pink-900 mb-2">Weitere romantische Ideen</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>🕯️ Kerzen für das Zimmer</li>
                  <li>🍫 Lokale Schokoladen-Spezialitäten</li>
                  <li>📷 Professionelle Paarfotos in der Landschaft</li>
                  <li>🥂 Champagner zum Sonnenuntergang</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Notes & Todo */}
        <section className="animate-staggered-fade delay-450">
          <Card className="glow-card border-pink-200/50 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <StickyNote className="h-5 w-5 text-pink-600" />
                📝 Notizen & Todo
              </CardTitle>
              <CardDescription>Was noch zu erledigen ist</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {todoItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    item.done
                      ? "bg-green-50/50 border-green-200/50 text-green-800"
                      : "bg-gradient-to-r from-pink-50/50 to-rose-50/30 border-pink-200/30"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded border-2 flex-shrink-0 ${
                      item.done
                        ? "bg-green-500 border-green-500"
                        : "border-pink-300 hover:border-pink-400 cursor-pointer"
                    }`}
                  >
                    {item.done && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm ${item.done ? "line-through" : ""}`}>{item.task}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      item.priority === "Hoch"
                        ? "border-red-300 text-red-700 bg-red-50"
                        : item.priority === "Mittel"
                        ? "border-orange-300 text-orange-700 bg-orange-50"
                        : "border-gray-300 text-gray-700 bg-gray-50"
                    }`}
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground animate-staggered-fade delay-500">
        <p className="flex items-center justify-center gap-2">
          <Heart className="h-4 w-4 text-pink-500" />
          <span>Ein unvergessliches Valentinstag-Wochenende für David & Partner</span>
          <Heart className="h-4 w-4 text-pink-500" />
        </p>
        <p className="text-xs mt-2 text-muted-foreground/80">
          Erstellt mit ❤️ für euer romantisches Wochenende in Südtirol
        </p>
      </footer>
    </main>
  );
}