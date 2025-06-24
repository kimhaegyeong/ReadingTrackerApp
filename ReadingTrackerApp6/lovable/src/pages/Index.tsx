import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, Search, User, Settings as SettingsIcon, Timer } from "lucide-react";
import BookLibrary from "@/components/BookLibrary";
import AddBookDialog from "@/components/AddBookDialog";
import BookDetail from "@/components/BookDetail";
import UserProfile from "@/components/UserProfile";
import BookSearch from "@/components/BookSearch";
import ReadingTimer from "@/components/ReadingTimer";
import Settings from "@/components/Settings";
import ReadingStats from "@/components/ReadingStats";

const Index = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("library");
  const [showSearch, setShowSearch] = useState(false);
  const [showReadingTimer, setShowReadingTimer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReadingStats, setShowReadingStats] = useState(false);

  const renderContent = () => {
    if (showSettings) {
      return <Settings onBack={() => setShowSettings(false)} />;
    }

    if (showReadingStats) {
      return <ReadingStats onBack={() => setShowReadingStats(false)} />;
    }

    if (showReadingTimer) {
      return <ReadingTimer onBack={() => setShowReadingTimer(false)} />;
    }

    if (showSearch) {
      return <BookSearch onBack={() => setShowSearch(false)} />;
    }

    if (selectedBook) {
      return <BookDetail book={selectedBook} onBack={() => setSelectedBook(null)} />;
    }

    switch (activeTab) {
      case "library":
        return <BookLibrary onBookSelect={setSelectedBook} />;
      case "search":
        return <BookSearch onBack={() => setActiveTab("library")} />;
      case "profile":
        return <UserProfile />;
      default:
        return <BookLibrary onBookSelect={setSelectedBook} />;
    }
  };

  // Hide header and navigation when showing any full-screen component
  const showHeaderAndNav = !showSearch && !selectedBook && !showReadingTimer && !showSettings && !showReadingStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      {showHeaderAndNav && (
        <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                리브노트
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowReadingStats(true)}
                variant="outline"
                className="rounded-full px-4"
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                통계
              </Button>
              <Button
                onClick={() => setShowReadingTimer(true)}
                variant="outline"
                className="rounded-full px-4"
              >
                <Timer className="h-4 w-4 mr-2" />
                독서 기록
              </Button>
              <Button
                onClick={() => setIsAddBookOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                책 추가
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`max-w-4xl mx-auto ${showHeaderAndNav ? 'px-4 py-6' : ''}`}>
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      {showHeaderAndNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t">
          <div className="max-w-4xl mx-auto px-4">
            <Tabs value={activeTab} onValueChange={(value) => {
              if (value === "search") {
                setShowSearch(true);
              } else if (value === "settings") {
                setShowSettings(true);
              } else {
                setActiveTab(value);
              }
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-transparent h-16">
                <TabsTrigger 
                  value="library" 
                  className="flex flex-col items-center space-y-1 data-[state=active]:text-blue-600"
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="text-xs">서재</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="search" 
                  className="flex flex-col items-center space-y-1 data-[state=active]:text-blue-600"
                >
                  <Search className="h-5 w-5" />
                  <span className="text-xs">검색</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="flex flex-col items-center space-y-1 data-[state=active]:text-blue-600"
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs">프로필</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="flex flex-col items-center space-y-1 data-[state=active]:text-blue-600"
                >
                  <SettingsIcon className="h-5 w-5" />
                  <span className="text-xs">설정</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </nav>
      )}

      {/* Add Book Dialog */}
      <AddBookDialog 
        open={isAddBookOpen} 
        onOpenChange={setIsAddBookOpen}
      />
    </div>
  );
};

export default Index;
