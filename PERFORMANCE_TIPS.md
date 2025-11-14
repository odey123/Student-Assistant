# Performance Optimization Tips

## Already Applied ✅
1. Debounced localStorage saves (500ms)
2. Optimized auto-scroll behavior
3. Removed unnecessary assistant pre-check API call

## Future Optimizations (if needed)

### 1. Lazy Load Chat Histories
Currently all chat histories load on mount. Consider pagination:
```typescript
// Load only recent 10 chats initially
const recentHistories = allHistories.slice(0, 10);
```

### 2. Virtualize Long Message Lists
For chats with 100+ messages, use `react-window` or `react-virtual`:
```bash
npm install react-window
```

### 3. Optimize Image Loading
Add lazy loading to university logos:
```tsx
<img src={logo} loading="lazy" />
```

### 4. Enable Next.js Image Optimization
Replace `<img>` with Next.js `<Image>` component for automatic optimization.

### 5. Add Loading Indicators
Show skeleton screens while initial data loads to improve perceived performance.

### 6. Cache Assistant Responses
Consider caching common questions to reduce API calls:
```typescript
const cacheKey = `${universityId}:${questionHash}`;
const cached = sessionStorage.getItem(cacheKey);
if (cached) return JSON.parse(cached);
```

### 7. Reduce Bundle Size
```bash
# Analyze bundle
npm run build
# Check bundle size in .next/
```

## Monitoring Performance

### Use React DevTools Profiler
1. Install React DevTools browser extension
2. Go to Profiler tab
3. Record a session
4. Look for slow components

### Use Lighthouse
1. Open Chrome DevTools
2. Run Lighthouse audit
3. Check Performance score

### Key Metrics to Monitor
- **Time to Interactive (TTI):** Should be < 3s
- **First Contentful Paint (FCP):** Should be < 1.5s
- **Largest Contentful Paint (LCP):** Should be < 2.5s
