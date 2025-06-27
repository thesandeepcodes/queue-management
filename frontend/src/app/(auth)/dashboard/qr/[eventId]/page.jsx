"use client";

import Button from "@/components/base/Button";
import DashboardTitleBar from "@/components/layout/dashboard/TitleBar";
import { useFetch } from "@/hooks/useFetch";
import { formatDate } from "@/lib/client/date";
import Script from "next/script";
import { QRCodeSVG } from "qrcode.react";
import { use, useEffect, useRef, useState } from "react"
import { FiClock, FiDownload, FiLoader, FiMap, FiUpload } from "react-icons/fi";

export default function EventQrCode({ params }) {
    const { eventId } = use(params)

    const [event, setEvent] = useState(null);

    const { loading: fetchingEvent, error: eventError } = useFetch(`/events/${eventId}`, {}, true, (result) => {
        setEvent(result?.data);
    });

    const qrWrapper = useRef(null);
    const qrCard = useRef(null);
    const [qrCodeWidth, setQrCodeWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            if (qrWrapper.current) {
                setQrCodeWidth(qrWrapper.current.offsetWidth - 100);
            }
        }

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [event]);

    const handleDownload = async () => {
        if (!qrCard.current || !window.html2canvas || !window.jspdf) return;

        const html2canvas = window.html2canvas;
        const { jsPDF } = window.jspdf;

        try {
            const canvas = await html2canvas(qrCard.current, {
                scale: 2,
            });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt",
                format: "a4"
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgOriginalWidth = canvas.width;
            const imgOriginalHeight = canvas.height;

            const margin = 0;
            const maxImgWidth = pageWidth - margin * 2;
            const maxImgHeight = pageHeight - margin * 2;

            let imgWidth = maxImgWidth;
            let imgHeight = (imgOriginalHeight * imgWidth) / imgOriginalWidth;

            if (imgHeight > maxImgHeight) {
                imgHeight = maxImgHeight;
                imgWidth = (imgOriginalWidth * imgHeight) / imgOriginalHeight;
            }

            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

            pdf.save(`${event?.name || "event"}_QRCode.pdf`);
        } catch (err) {
            console.error("Failed to generate/download PDF", err);
        }
    };


    if (eventError?.show) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-lg text-red-600 font-bold">
                    {eventError?.message}
                </div>
            </div>
        )
    }


    return fetchingEvent ? (
        <div className="w-full h-screen flex items-center justify-center">
            <FiLoader className="w-8 h-8 animate-spin text-neutral-500" />
        </div>
    ) : (
        <div>
            <Script
                src="https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.11/dist/html2canvas-pro.min.js"
                strategy="afterInteractive"
            />

            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
                strategy="afterInteractive"
            />

            <DashboardTitleBar
                title={"QR Code"}
                description={"Download or print a qr code for your event."}
            >
                <Button onClick={handleDownload}>
                    <FiDownload />
                    <span>Download</span>
                </Button>
            </DashboardTitleBar>

            <div ref={qrCard} className="w-full mx-auto max-w-xl rounded-md bg-white">
                <div className="p-6 border-b border-neutral-300">
                    <div className="text-2xl/relaxed font-bold text-primary mb-3">{event?.name}</div>
                    <div className="text-lg/relaxed text-neutral-600">{event?.description}</div>
                </div>

                <div ref={qrWrapper} className="w-full my-3 flex bg-white p-8 rounded-md items-center justify-center">
                    <QRCodeSVG
                        bgColor="#fff"
                        width={qrCodeWidth}
                        height={qrCodeWidth}
                        fgColor="#3B82F6"
                        level="H"
                        value={`${process.env.NEXT_PUBLIC_BASE_URL}/join/${event?._id}`}
                    />
                </div>

                <div className="p-6 border-t border-neutral-300 flex flex-col gap-5">
                    <div className="flex items-center gap-3 text-neutral-600 text-lg/loose">
                        <FiMap className="w-5.5 h-5.5 text-primary" />
                        <span>Venue:</span>
                        <span>{event?.venue || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-neutral-600 text-lg/loose">
                        <FiClock className="w-5.5 h-5.5 text-primary" />
                        <span>Event Date:</span>
                        <span>{formatDate(event?.eventDate, "dd MMMM, yyyy")}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}