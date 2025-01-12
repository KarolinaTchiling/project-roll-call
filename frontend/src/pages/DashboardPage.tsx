import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ToggleButton from "../components/dashboard/ToggleButton";
import WordType from '../components/dashboard/WordType'; 
import CalendarType from '../components/dashboard/CalendarType'; 
import ColorType from '../components/dashboard/ColorType'; 
import ChooseCalendars from '../components/dashboard/ChooseCalendars'; 
import Switch from '../components/dashboard/SwitchWQ'; 
import Slider from '../components/dashboard/SliderFG'; 

const DashboardPage = () => {
    const [name, setName] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | null>("Key Word");
    const [greeting, setGreeting] = useState<string>("word"); // Default to "word"
    const [futureWeeks, setFutureWeeks] = useState<number>(4); // Default to 4 weeks
    const [loading, setLoading] = useState(false); // For loading state
    const [refreshKey, setRefreshKey] = useState(0); // Key to trigger refresh

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch name
                const nameResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/name`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!nameResponse.ok) {
                    throw new Error(`HTTP error! Status: ${nameResponse.status}`);
                }
                const nameData = await nameResponse.json();
                setName(nameData); // Assuming the name is directly in the response object

                // Fetch settings
                const settingsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/setting/get_settings`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!settingsResponse.ok) {
                    throw new Error(`HTTP error! Status: ${settingsResponse.status}`);
                }
                const settingsData = await settingsResponse.json();

                // Map backend `priority_type` to toggle options
                const priorityMap: { [key: string]: string } = {
                    word_type: "Key Word",
                    color_type: "Event Color",
                    calendar_type: "Calendar",
                };

                setSelectedOption(priorityMap[settingsData.priority_type] || "Key Word");
                setGreeting(settingsData.greeting || "word"); // Set greeting from backend
                setFutureWeeks(settingsData.future_weeks || 4); // Set future weeks from backend
            } catch (err) {
                console.error("Error fetching settings or name:", err);
            }
        };

        fetchSettings();
    }, []);

    const handleSliderChange = async (newWeeks: number) => {
        setFutureWeeks(newWeeks);

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/setting/update_weeks`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ future_weeks: newWeeks }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

        } catch (err) {
            console.error("Error updating future weeks:", err);
        }
    };

    const handleUpdateCalendars = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/setting/set_calendars`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setRefreshKey((prevKey) => prevKey + 1);
        } catch (err) {
            console.error("Error updating calendars:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleChange = (newOption: string | null) => {
        setSelectedOption(newOption);

        // Optionally, update the backend with the new priority_type
        const priorityMap: { [key: string]: string } = {
            "Key Word": "word_type",
            "Event Color": "color_type",
            "Calendar": "calendar_type",
        };

        if (newOption) {
            fetch(`${import.meta.env.VITE_BASE_URL}/setting/update_priority_type`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ priority_type: priorityMap[newOption] }),
            }).catch((err) => console.error("Error updating priority type:", err));
        }
    };

    const toggleGreeting = () => {
        const newGreeting = greeting === "word" ? "quote" : "word";
        setGreeting(newGreeting);

        // Update the backend with the new greeting
        fetch(`${import.meta.env.VITE_BASE_URL}/setting/update_greeting`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ greeting: newGreeting }),
        }).catch((err) => console.error("Error updating greeting:", err));
    };

    return (
        <div className="min-h-screen min-w-[1525px] flex flex-col ">
        <Navbar />
        <div className="flex justify-center items-center flex-grow">
            <div className="border border-[15px] border-[#CAEBF6] bg-[#CAEBF6] rounded-[20px] shadow-lg w-11/12 md:w-5/6 h-[80vh] p-1">
            {/* Dashboard Title (outside of the scrollable content) */}
            <h1 className="pt-3 text-4xl text-gray-800 font-medium text-center pb-3">
                {name}'s Dashboard
            </h1>
            {/* Scrollable Content */}
            <div className="overflow-y-auto scrollbar scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-[#96d0e3] h-[calc(100%-4rem)] pb-5">
                <div className="flex flex-row justify-center">
                <div className="basis-1/2 ml-7">
                    <div className="justify-self-center mt-4">
                        
                        {/* Calendar Selection */}
                        <div className="text-2xl font-semibold text-center mb-2 mt-5">
                            Calendar Selection
                        </div>
                        <p className="text-center font-semibold mb-2">
                            Choose which of your Google Calendars will be included in your Roll Call.
                        </p>
                        <div className="flex flex-row gap-[49%] justify-center text-lg font-semibold mt-3">
                            <p>Include</p>
                            <p>Exclude</p>
                        </div>
                        <ChooseCalendars refreshKey={refreshKey} />

                        <div className="mt-4 flex flex-row w-[560px]">
                            <p className="basis-[60%]">If you have added or deleted calendars from your Google account, you must update them.</p>

                            <div className="basis-[40%] text-center">
                            <button
                                onClick={handleUpdateCalendars}
                                className="bg-[#689eb0] text-white px-4 py-2 rounded hover:bg-blue-300"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Google Calendars"}
                            </button>
                            </div>
                        </div>


                        {/* Greeting Selection */}
                        <div>
                            <div className="text-2xl font-semibold text-center mb-2 mt-8">
                                Greeting Selection
                            </div>
                            <div className="flex flex-row gap-[10%] items-center font-semibold mt-3">
                                <p className="text-center mb-2">
                                    Choose your greeting preference.
                                </p>
                                <div className="ml">
                                    <Switch greeting={greeting} toggleGreeting={toggleGreeting} />
                                </div>
                                
                            </div>
                        </div>

                        {/* Future Week Selection */}
                        <div>
                            <div className="text-2xl font-semibold text-center mb-2 mt-8">
                                Future at Glance Length
                            </div>
                            <div className="flex flex-col gap-[10%] items-center mt-3">
                                <p className="text-center mb-2">
                                    Select how many weeks in advance your future at glance report will consider.
                                </p>
                                <div className="ml">
                                    <Slider value={futureWeeks} onChange={handleSliderChange} />
                                </div>
                                
                            </div>
                        </div>
                       

                    </div>
                </div>

                {/* Prioritization Selection */}
                <div className="justify-self-center overflow-auto mr-7 h-[100%]">
                    <div>
                    <div className="text-2xl font-semibold text-center mb-2 mt-5">
                        Prioritization Preference
                    </div>
                    <p className="text-center font-semibold mb-2">
                        Select the method by which you like to prioritize your Google calendar
                        events.
                    </p>
                    <ul className="ml-4">
                        <li>
                        ‣ Key words: Add custom keywords to set prioritization.
                        </li>
                        <li>
                        ‣ Event color: Set event prioritization based on the color of events in
                        your Google calendar.
                        </li>
                        <li>
                        ‣ Calendar: Assign prioritization based on each of your Google
                        Calendars.
                        </li>
                    </ul>
                    <div className="justify-self-center mt-4">
                        <ToggleButton
                        onToggleChange={handleToggleChange}
                        initialValue={selectedOption}
                        />
                    </div>
                    </div>
                    {/* Type Selection */}
                    <div className="justify-self-center mt-4">
                        {selectedOption === "Key Word" && <WordType />}
                        {selectedOption === "Event Color" && <ColorType />}
                        {selectedOption === "Calendar" && <CalendarType />}
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>

    );
};

export default DashboardPage;
