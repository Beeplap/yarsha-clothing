"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  viewAllHref?: string;
  onViewAllClick?: () => void;
  isShowingAll?: boolean;
}

export default function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
  viewAllHref,
  onViewAllClick,
  isShowingAll = false,
}: PaginationBarProps) {
  const progressPercent = Math.min(100, Math.max(0, (currentPage / Math.max(1, totalPages)) * 100));

  return (
    <div 
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1.5rem",
        marginTop: "3rem",
        paddingTop: "2rem",
        borderTop: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
        fontFamily: "var(--body-font)",
        color: "var(--foreground)"
      }}
    >
      {/* Left side: Page number & progress bar matching ScreenClip */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "220px" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 500, letterSpacing: "0.2px" }}>
          Page: <span style={{ fontWeight: 700 }}>{currentPage}</span> of <span style={{ fontWeight: 700 }}>{Math.max(1, totalPages)}</span>
        </div>
        
        {/* Progress Bar Line */}
        <div style={{ width: "240px", maxWidth: "100%", height: "2px", backgroundColor: "color-mix(in srgb, var(--foreground) 12%, transparent)", position: "relative", overflow: "hidden" }}>
          <div 
            style={{
              height: "100%",
              backgroundColor: "var(--foreground)",
              width: `${progressPercent}%`,
              transition: "width 0.3s ease"
            }}
          />
        </div>
      </div>

      {/* Right side: Action Buttons matching ScreenClip */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        
        {/* Previous Button */}
        {currentPage > 1 && onPageChange && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem 1.5rem",
              border: "1px solid var(--foreground)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <ArrowLeft size={16} /> Previous
          </button>
        )}

        {/* Next Button matching ScreenClip boxed Next -> */}
        {currentPage < totalPages && onPageChange && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem 1.5rem",
              border: "1px solid var(--foreground)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Next <ArrowRight size={16} />
          </button>
        )}

        {/* View All Button */}
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem 1.75rem",
              borderRadius: "30px",
              backgroundColor: "var(--foreground)",
              color: "var(--background)",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}
          >
            View All Products →
          </Link>
        ) : onViewAllClick ? (
          <button
            onClick={onViewAllClick}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem 1.75rem",
              borderRadius: "30px",
              backgroundColor: "var(--foreground)",
              color: "var(--background)",
              border: "none",
              fontWeight: 800,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              cursor: "pointer"
            }}
          >
            {isShowingAll ? "Show Paged" : "View All Products →"}
          </button>
        ) : null}

      </div>
    </div>
  );
}
