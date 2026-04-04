import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1115", // Obsidian Base
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24, // Compact header
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: "#00F5D4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: "#0F1115",
    fontWeight: "800",
    fontSize: 12,
  },
  list: {
    paddingHorizontal: 15, // Tighter horizontal margins for the list
    paddingTop: 5,
  },
  card: {
    backgroundColor: "#1C1F26",
    borderRadius: 16, // More modern, tight radius
    marginBottom: 12, // Significant reduction in gap between cards
    borderWidth: 1,
    borderColor: "#2D333F",
    overflow: "hidden",
    padding: 16, // Reduced internal padding
  },
  cardMainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  sourceTag: {
    color: "#00F5D4",
    fontWeight: "900",
    fontSize: 10,
    textTransform: "uppercase",
    marginBottom: 4, // Tightened
    letterSpacing: 1.5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 6, // Tightened
    lineHeight: 24, // Optimized for multi-line titles
  },
  cardExcerpt: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 12, // Reduced vertical drift
  },
  readMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readMoreText: {
    color: "#00F5D4",
    fontSize: 14,
    fontWeight: "700",
  },
  unsaveBtn: {
    width: 36, // Smaller action button
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2D333F",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 20,
    marginBottom: 8,
    color: "#FFF",
  },
  emptyText: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 22,
  },
});
