// Sliding Window Patterns & Algorithms Guide - JavaScript

// Application state
let patternsData = [];
let filteredPatterns = [];
let currentTheme = "auto";
let searchTimeout = null;

// Visual images mapping
const visualImages = {
  "Fixed Size Sliding Window":
    "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/c6b3d506-7f47-41ee-aef7-d7d23bef6846.png",
  "Variable Size Sliding Window":
    "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/220553a2-baa5-4b5a-beea-76f84c0ff1a4.png",
  "Sliding Window Maximum/Minimum":
    "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/3b44a206-470c-4d46-b06e-682c6172cf98.png",
  "Frequency-based Sliding Window":
    "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/1185ea3d-8f18-4743-9a45-8c30d80855f9.png",
  "Sliding Window on Strings":
    "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d84c8133-608e-44ef-986e-13898b51ba26.png",
};

// Sliding window patterns data
const slidingWindowPatterns = [
  {
    id: 1,
    name: "Fixed Size Sliding Window",
    description:
      "Maintain a window of fixed size K and slide it across the array to process elements",
    time_complexity: "O(n)",
    space_complexity: "O(1)",
    use_cases: [
      "Finding maximum/minimum in subarrays of size K",
      "Average calculations over fixed intervals",
      "Pattern matching with fixed window size",
      "Moving statistics computations",
    ],
    leetcode_problems: [
      { title: "Maximum Average Subarray I", id: 643, difficulty: "easy" },
      {
        title: "Maximum Number of Vowels in a Substring",
        id: 1456,
        difficulty: "medium",
      },
      { title: "Contains Duplicate II", id: 219, difficulty: "easy" },
    ],
    code_template: `public int fixedWindow(int[] arr, int k) {
    // Initialize window sum
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    int maxSum = windowSum;
    
    // Slide the window
    for (int i = k; i < arr.length; i++) {
        // Remove leftmost element, add rightmost
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}

// Example: Maximum average subarray
public double findMaxAverage(int[] nums, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    int maxSum = windowSum;
    
    for (int i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return (double) maxSum / k;
}`,
    visualization: "Fixed Size Sliding Window",
  },
  {
    id: 2,
    name: "Variable Size Sliding Window",
    description:
      "Dynamic window that expands and contracts based on conditions using two pointers",
    time_complexity: "O(n)",
    space_complexity: "O(1) to O(n)",
    use_cases: [
      "Finding longest substring with conditions",
      "Minimum window covering specific criteria",
      "Dynamic subarray problems",
      "Optimization with flexible constraints",
    ],
    leetcode_problems: [
      {
        title: "Longest Substring Without Repeating Characters",
        id: 3,
        difficulty: "medium",
      },
      { title: "Minimum Size Subarray Sum", id: 209, difficulty: "medium" },
      {
        title: "Longest Substring with At Most K Distinct Characters",
        id: 340,
        difficulty: "medium",
      },
    ],
    code_template: `public int variableWindow(int[] arr, int target) {
    int left = 0;
    int result = Integer.MAX_VALUE;
    int windowSum = 0;
    
    for (int right = 0; right < arr.length; right++) {
        // Expand window
        windowSum += arr[right];
        
        // Contract window while condition is met
        while (windowSum >= target) {
            result = Math.min(result, right - left + 1);
            windowSum -= arr[left];
            left++;
        }
    }
    
    return result == Integer.MAX_VALUE ? 0 : result;
}

// Example: Longest substring without repeating characters
public int lengthOfLongestSubstring(String s) {
    Set<Character> charSet = new HashSet<>();
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        while (charSet.contains(s.charAt(right))) {
            charSet.remove(s.charAt(left));
            left++;
        }
        charSet.add(s.charAt(right));
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
    visualization: "Variable Size Sliding Window",
  },
  {
    id: 3,
    name: "Sliding Window Maximum/Minimum",
    description:
      "Find maximum or minimum element in each sliding window using deque for optimization",
    time_complexity: "O(n)",
    space_complexity: "O(k)",
    use_cases: [
      "Sliding window maximum/minimum queries",
      "Range maximum/minimum problems",
      "Monotonic deque applications",
      "Stock price analysis over time windows",
    ],
    leetcode_problems: [
      { title: "Sliding Window Maximum", id: 239, difficulty: "hard" },
      { title: "Longest Continuous Subarray", id: 1438, difficulty: "medium" },
      { title: "Constrained Subsequence Sum", id: 1425, difficulty: "hard" },
    ],
    code_template: `public int[] slidingWindowMaximum(int[] nums, int k) {
    Deque<Integer> dq = new ArrayDeque<>();  // Store indices
    int[] result = new int[nums.length - k + 1];
    int idx = 0;
    
    for (int i = 0; i < nums.length; i++) {
        // Remove indices outside current window
        while (!dq.isEmpty() && dq.peekFirst() <= i - k) {
            dq.pollFirst();
        }
        
        // Remove indices with smaller values
        while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) {
            dq.pollLast();
        }
        
        dq.offerLast(i);
        
        // Add maximum to result when window is complete
        if (i >= k - 1) {
            result[idx++] = nums[dq.peekFirst()];
        }
    }
    
    return result;
}

// Example: Longest subarray with absolute diff <= limit
public int longestSubarray(int[] nums, int limit) {
    Deque<Integer> maxDeque = new ArrayDeque<>();  // Decreasing order
    Deque<Integer> minDeque = new ArrayDeque<>();  // Increasing order
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < nums.length; right++) {
        // Maintain max deque
        while (!maxDeque.isEmpty() && nums[maxDeque.peekLast()] <= nums[right]) {
            maxDeque.pollLast();
        }
        maxDeque.offerLast(right);
        
        // Maintain min deque
        while (!minDeque.isEmpty() && nums[minDeque.peekLast()] >= nums[right]) {
            minDeque.pollLast();
        }
        minDeque.offerLast(right);
        
        // Contract window if condition violated
        while (nums[maxDeque.peekFirst()] - nums[minDeque.peekFirst()] > limit) {
            if (maxDeque.peekFirst() == left) {
                maxDeque.pollFirst();
            }
            if (minDeque.peekFirst() == left) {
                minDeque.pollFirst();
            }
            left++;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
    visualization: "Sliding Window Maximum/Minimum",
  },
  {
    id: 4,
    name: "Frequency-based Sliding Window",
    description:
      "Use hash map to track character/element frequencies in the sliding window",
    time_complexity: "O(n)",
    space_complexity: "O(k)",
    use_cases: [
      "Character frequency problems",
      "Anagram detection in sliding windows",
      "Pattern matching with character counts",
      "Substring problems with constraints",
    ],
    leetcode_problems: [
      { title: "Find All Anagrams in a String", id: 438, difficulty: "medium" },
      { title: "Permutation in String", id: 567, difficulty: "medium" },
      { title: "Minimum Window Substring", id: 76, difficulty: "hard" },
    ],
    code_template: `public List<Integer> frequencySlidingWindow(String s, String pattern) {
    if (pattern.length() > s.length()) {
        return new ArrayList<>();
    }
    
    Map<Character, Integer> patternCount = new HashMap<>();
    Map<Character, Integer> windowCount = new HashMap<>();
    List<Integer> result = new ArrayList<>();
    
    // Count pattern characters
    for (char c : pattern.toCharArray()) {
        patternCount.put(c, patternCount.getOrDefault(c, 0) + 1);
    }
    
    // Fixed window approach
    for (int i = 0; i < s.length(); i++) {
        char rightChar = s.charAt(i);
        windowCount.put(rightChar, windowCount.getOrDefault(rightChar, 0) + 1);
        
        // Remove character from window if window size > pattern length
        if (i >= pattern.length()) {
            char leftChar = s.charAt(i - pattern.length());
            windowCount.put(leftChar, windowCount.get(leftChar) - 1);
            if (windowCount.get(leftChar) == 0) {
                windowCount.remove(leftChar);
            }
        }
        
        // Check if window matches pattern
        if (windowCount.equals(patternCount)) {
            result.add(i - pattern.length() + 1);
        }
    }
    
    return result;
}

// Example: Minimum window substring
public String minWindow(String s, String t) {
    if (s.length() == 0 || t.length() == 0) {
        return "";
    }
    
    Map<Character, Integer> dictT = new HashMap<>();
    for (char c : t.toCharArray()) {
        dictT.put(c, dictT.getOrDefault(c, 0) + 1);
    }
    
    int required = dictT.size();
    int left = 0, right = 0;
    int formed = 0;
    Map<Character, Integer> windowCounts = new HashMap<>();
    
    int[] ans = {-1, 0, 0};  // length, left, right
    
    while (right < s.length()) {
        char character = s.charAt(right);
        windowCounts.put(character, windowCounts.getOrDefault(character, 0) + 1);
        
        if (dictT.containsKey(character) && 
            windowCounts.get(character).intValue() == dictT.get(character).intValue()) {
            formed++;
        }
        
        while (left <= right && formed == required) {
            character = s.charAt(left);
            
            if (ans[0] == -1 || right - left + 1 < ans[0]) {
                ans[0] = right - left + 1;
                ans[1] = left;
                ans[2] = right;
            }
            
            windowCounts.put(character, windowCounts.get(character) - 1);
            if (dictT.containsKey(character) && 
                windowCounts.get(character).intValue() < dictT.get(character).intValue()) {
                formed--;
            }
            
            left++;
        }
        
        right++;
    }
    
    return ans[0] == -1 ? "" : s.substring(ans[1], ans[2] + 1);
}`,
    visualization: "Frequency-based Sliding Window",
  },
  {
    id: 5,
    name: "Two Pointers Sliding Window",
    description:
      "Use two pointers technique combined with sliding window for array problems",
    time_complexity: "O(n)",
    space_complexity: "O(1)",
    use_cases: [
      "Target sum problems in arrays",
      "Palindrome detection",
      "Meeting conditions with two boundaries",
      "Optimization problems with constraints",
    ],
    leetcode_problems: [
      {
        title: "Two Sum II - Input Array Is Sorted",
        id: 167,
        difficulty: "medium",
      },
      { title: "3Sum Closest", id: 16, difficulty: "medium" },
      { title: "Container With Most Water", id: 11, difficulty: "medium" },
    ],
    code_template: `public int[] twoPointersSlidingWindow(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    
    while (left < right) {
        int currentSum = arr[left] + arr[right];
        
        if (currentSum == target) {
            return new int[]{left, right};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return new int[]{-1, -1};
}

// Example: Container with most water
public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxWater = 0;
    
    while (left < right) {
        // Calculate current area
        int width = right - left;
        int currentHeight = Math.min(height[left], height[right]);
        int currentWater = width * currentHeight;
        maxWater = Math.max(maxWater, currentWater);
        
        // Move pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}

// Example: Longest palindromic substring
public String longestPalindrome(String s) {
    if (s == null || s.length() < 1) return "";
    
    int start = 0;
    int maxLen = 0;
    
    for (int i = 0; i < s.length(); i++) {
        // Odd length palindromes
        int len1 = expandAroundCenter(s, i, i);
        // Even length palindromes
        int len2 = expandAroundCenter(s, i, i + 1);
        
        int currentMax = Math.max(len1, len2);
        if (currentMax > maxLen) {
            maxLen = currentMax;
            start = i - (currentMax - 1) / 2;
        }
    }
    
    return s.substring(start, start + maxLen);
}

private int expandAroundCenter(String s, int left, int right) {
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    return right - left - 1;
}`,
    visualization: "Variable Size Sliding Window",
  },
  {
    id: 6,
    name: "Multiple Arrays Sliding Window",
    description:
      "Sliding window technique applied across multiple arrays or dimensions",
    time_complexity: "O(n + m)",
    space_complexity: "O(1) to O(k)",
    use_cases: [
      "Merging multiple sorted arrays",
      "Finding common elements across arrays",
      "Multi-dimensional sliding window",
      "Cross-array pattern matching",
    ],
    leetcode_problems: [
      { title: "Merge Two Sorted Arrays", id: 88, difficulty: "easy" },
      { title: "Intersection of Two Arrays II", id: 350, difficulty: "easy" },
      { title: "Median of Two Sorted Arrays", id: 4, difficulty: "hard" },
    ],
    code_template: `public int[] mergeArraysSlidingWindow(int[] arr1, int[] arr2) {
    int i = 0, j = 0;
    List<Integer> result = new ArrayList<>();
    
    // Two pointer approach on two arrays
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] <= arr2[j]) {
            result.add(arr1[i]);
            i++;
        } else {
            result.add(arr2[j]);
            j++;
        }
    }
    
    // Add remaining elements
    while (i < arr1.length) {
        result.add(arr1[i]);
        i++;
    }
    
    while (j < arr2.length) {
        result.add(arr2[j]);
        j++;
    }
    
    return result.stream().mapToInt(Integer::intValue).toArray();
}

// Example: Intersection of two arrays
public int[] intersect(int[] nums1, int[] nums2) {
    Map<Integer, Integer> count1 = new HashMap<>();
    Map<Integer, Integer> count2 = new HashMap<>();
    List<Integer> result = new ArrayList<>();
    
    for (int num : nums1) {
        count1.put(num, count1.getOrDefault(num, 0) + 1);
    }
    
    for (int num : nums2) {
        count2.put(num, count2.getOrDefault(num, 0) + 1);
    }
    
    for (int num : count1.keySet()) {
        if (count2.containsKey(num)) {
            int times = Math.min(count1.get(num), count2.get(num));
            for (int i = 0; i < times; i++) {
                result.add(num);
            }
        }
    }
    
    return result.stream().mapToInt(Integer::intValue).toArray();
}

// Example: Sliding window on 2D matrix
public int maxSumRectangle(int[][] matrix, int k) {
    if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
        return 0;
    }
    
    int rows = matrix.length;
    int cols = matrix[0].length;
    int maxSum = Integer.MIN_VALUE;
    
    // Fix left and right boundaries
    for (int left = 0; left < cols; left++) {
        int[] temp = new int[rows];
        for (int right = left; right < cols; right++) {
            // Add current column to temp array
            for (int i = 0; i < rows; i++) {
                temp[i] += matrix[i][right];
            }
            
            // Find maximum subarray sum <= k
            int currentMax = kadaneWithConstraint(temp, k);
            maxSum = Math.max(maxSum, currentMax);
        }
    }
    
    return maxSum;
}

private int kadaneWithConstraint(int[] arr, int k) {
    int maxSum = Integer.MIN_VALUE;
    int currentSum = 0;
    
    for (int num : arr) {
        currentSum = Math.max(num, currentSum + num);
        if (currentSum <= k) {
            maxSum = Math.max(maxSum, currentSum);
        }
    }
    
    return maxSum;
}`,
    visualization: "Fixed Size Sliding Window",
  },
  {
    id: 7,
    name: "Sliding Window with Constraints",
    description:
      "Apply sliding window with additional constraints like distinct elements or value limits",
    time_complexity: "O(n)",
    space_complexity: "O(k)",
    use_cases: [
      "Subarray with at most K distinct elements",
      "Constraints on sum, count, or values",
      "Conditional sliding window expansion",
      "Resource allocation with limits",
    ],
    leetcode_problems: [
      {
        title: "Subarrays with K Different Integers",
        id: 992,
        difficulty: "hard",
      },
      { title: "Fruit Into Baskets", id: 904, difficulty: "medium" },
      {
        title: "Longest Substring with At Most Two Distinct Characters",
        id: 159,
        difficulty: "medium",
      },
    ],
    code_template: `public int slidingWindowWithConstraints(int[] arr, int k) {
    // Exactly k distinct = at_most_k - at_most_(k-1)
    return atMostKDistinct(arr, k) - atMostKDistinct(arr, k - 1);
}

private int atMostKDistinct(int[] arr, int k) {
    if (k == 0) return 0;
    
    int left = 0;
    int count = 0;
    Map<Integer, Integer> charCount = new HashMap<>();
    
    for (int right = 0; right < arr.length; right++) {
        if (charCount.getOrDefault(arr[right], 0) == 0) {
            k--;
        }
        charCount.put(arr[right], charCount.getOrDefault(arr[right], 0) + 1);
        
        while (k < 0) {
            charCount.put(arr[left], charCount.get(arr[left]) - 1);
            if (charCount.get(arr[left]) == 0) {
                k++;
            }
            left++;
        }
        
        count += right - left + 1;
    }
    
    return count;
}

// Example: Fruit into baskets (at most 2 types)
public int totalFruit(int[] fruits) {
    int left = 0;
    int maxFruits = 0;
    Map<Integer, Integer> basket = new HashMap<>();
    
    for (int right = 0; right < fruits.length; right++) {
        basket.put(fruits[right], basket.getOrDefault(fruits[right], 0) + 1);
        
        // If more than 2 types, shrink window
        while (basket.size() > 2) {
            basket.put(fruits[left], basket.get(fruits[left]) - 1);
            if (basket.get(fruits[left]) == 0) {
                basket.remove(fruits[left]);
            }
            left++;
        }
        
        maxFruits = Math.max(maxFruits, right - left + 1);
    }
    
    return maxFruits;
}

// Example: Subarray sum with constraints
public int subarraySumConstraint(int[] nums, int target, int maxLength) {
    int left = 0;
    int currentSum = 0;
    int minLength = Integer.MAX_VALUE;
    
    for (int right = 0; right < nums.length; right++) {
        currentSum += nums[right];
        
        // Contract window while sum >= target and length <= maxLength
        while (currentSum >= target && right - left + 1 <= maxLength) {
            minLength = Math.min(minLength, right - left + 1);
            currentSum -= nums[left];
            left++;
        }
    }
    
    return minLength == Integer.MAX_VALUE ? -1 : minLength;
}`,
    visualization: "Frequency-based Sliding Window",
  },
  {
    id: 8,
    name: "Binary Search on Sliding Window",
    description:
      "Combine binary search with sliding window for optimization problems",
    time_complexity: "O(n log(max-min))",
    space_complexity: "O(1)",
    use_cases: [
      "Finding optimal window size",
      "Minimizing/maximizing sliding window properties",
      "Binary search on answer with sliding window validation",
      "Resource optimization problems",
    ],
    leetcode_problems: [
      {
        title: "Minimum Number of Days to Make m Bouquets",
        id: 1482,
        difficulty: "medium",
      },
      {
        title: "Magnetic Force Between Two Balls",
        id: 1552,
        difficulty: "medium",
      },
      { title: "Divide Chocolate", id: 1231, difficulty: "hard" },
    ],
    code_template: `public int binarySearchSlidingWindow(int[] arr, int target) {
    int left = 1, right = arr.length;
    int result = -1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (canAchieveWithWindowSize(arr, target, mid)) {
            result = mid;
            right = mid - 1;  // Try smaller window
        } else {
            left = mid + 1;
        }
    }
    
    return result;
}

private boolean canAchieveWithWindowSize(int[] arr, int target, int windowSize) {
    // Check if target can be achieved with given window size
    for (int i = 0; i <= arr.length - windowSize; i++) {
        int windowSum = 0;
        for (int j = i; j < i + windowSize; j++) {
            windowSum += arr[j];
        }
        if (windowSum >= target) {
            return true;
        }
    }
    return false;
}

// Example: Minimum days to make bouquets
public int minDays(int[] bloomDay, int m, int k) {
    if (m * k > bloomDay.length) {
        return -1;
    }
    
    int left = Arrays.stream(bloomDay).min().orElse(0);
    int right = Arrays.stream(bloomDay).max().orElse(0);
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (canMakeBouquets(bloomDay, m, k, mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
}

private boolean canMakeBouquets(int[] bloomDay, int m, int k, int days) {
    int bouquets = 0;
    int consecutive = 0;
    
    for (int bloom : bloomDay) {
        if (bloom <= days) {
            consecutive++;
            if (consecutive == k) {
                bouquets++;
                consecutive = 0;
            }
        } else {
            consecutive = 0;
        }
    }
    
    return bouquets >= m;
}

// Example: Divide chocolate with binary search
public int maximizeSweetness(int[] sweetness, int k) {
    int left = Arrays.stream(sweetness).min().orElse(0);
    int right = Arrays.stream(sweetness).sum();
    
    while (left < right) {
        int mid = left + (right - left + 1) / 2;
        
        if (canDivide(sweetness, k, mid)) {
            left = mid;
        } else {
            right = mid - 1;
        }
    }
    
    return left;
}

private boolean canDivide(int[] sweetness, int k, int minSweetness) {
    int cuts = 0;
    int currentSum = 0;
    
    for (int sweet : sweetness) {
        currentSum += sweet;
        if (currentSum >= minSweetness) {
            cuts++;
            currentSum = 0;
        }
    }
    
    return cuts >= k + 1;
}`,
    visualization: "Fixed Size Sliding Window",
  },
  {
    id: 9,
    name: "Sliding Window on Strings",
    description:
      "Specialized sliding window techniques for string processing and pattern matching",
    time_complexity: "O(n)",
    space_complexity: "O(k)",
    use_cases: [
      "String pattern matching",
      "Anagram detection",
      "Longest/shortest substring problems",
      "Character replacement optimization",
    ],
    leetcode_problems: [
      {
        title: "Longest Repeating Character Replacement",
        id: 424,
        difficulty: "medium",
      },
      {
        title: "Longest Substring with At Most K Distinct Characters",
        id: 340,
        difficulty: "medium",
      },
      { title: "Minimum Window Substring", id: 76, difficulty: "hard" },
    ],
    code_template: `public int slidingWindowStrings(String s, int k) {
    int left = 0;
    int maxLength = 0;
    Map<Character, Integer> charCount = new HashMap<>();
    int maxFreq = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char rightChar = s.charAt(right);
        charCount.put(rightChar, charCount.getOrDefault(rightChar, 0) + 1);
        maxFreq = Math.max(maxFreq, charCount.get(rightChar));
        
        // If window size - max_freq > k, shrink window
        if (right - left + 1 - maxFreq > k) {
            char leftChar = s.charAt(left);
            charCount.put(leftChar, charCount.get(leftChar) - 1);
            left++;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Example: Longest repeating character replacement
public int characterReplacement(String s, int k) {
    int left = 0;
    int maxLength = 0;
    Map<Character, Integer> charCount = new HashMap<>();
    int maxFreq = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char rightChar = s.charAt(right);
        charCount.put(rightChar, charCount.getOrDefault(rightChar, 0) + 1);
        maxFreq = Math.max(maxFreq, charCount.get(rightChar));
        
        // Current window size - most frequent char > k replacements
        if (right - left + 1 - maxFreq > k) {
            char leftChar = s.charAt(left);
            charCount.put(leftChar, charCount.get(leftChar) - 1);
            left++;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Example: Check if string contains permutation
public boolean checkInclusion(String s1, String s2) {
    if (s1.length() > s2.length()) {
        return false;
    }
    
    Map<Character, Integer> s1Count = new HashMap<>();
    Map<Character, Integer> windowCount = new HashMap<>();
    
    // Count characters in s1
    for (char c : s1.toCharArray()) {
        s1Count.put(c, s1Count.getOrDefault(c, 0) + 1);
    }
    
    for (int i = 0; i < s2.length(); i++) {
        char rightChar = s2.charAt(i);
        // Add current character
        windowCount.put(rightChar, windowCount.getOrDefault(rightChar, 0) + 1);
        
        // Remove character outside window
        if (i >= s1.length()) {
            char leftChar = s2.charAt(i - s1.length());
            windowCount.put(leftChar, windowCount.get(leftChar) - 1);
            if (windowCount.get(leftChar) == 0) {
                windowCount.remove(leftChar);
            }
        }
        
        // Check if window matches s1
        if (windowCount.equals(s1Count)) {
            return true;
        }
    }
    
    return false;
}`,
    visualization: "Sliding Window on Strings",
  },
  {
    id: 10,
    name: "Advanced Sliding Window",
    description:
      "Complex sliding window patterns for advanced problems and optimizations",
    time_complexity: "O(n log n) to O(n)",
    space_complexity: "O(n)",
    use_cases: [
      "Multi-dimensional sliding window",
      "Sliding window with data structures",
      "Advanced optimization problems",
      "Complex constraint handling",
    ],
    leetcode_problems: [
      { title: "Sliding Window Median", id: 480, difficulty: "hard" },
      {
        title: "Maximum Sum of 3 Non-Overlapping Subarrays",
        id: 689,
        difficulty: "hard",
      },
      { title: "Minimum Window Subsequence", id: 727, difficulty: "hard" },
    ],
    code_template: `class SlidingWindowMedian {
    private PriorityQueue<Integer> small;  // max heap
    private PriorityQueue<Integer> large;  // min heap
    private Map<Integer, Integer> hashTable;
    
    public SlidingWindowMedian() {
        this.small = new PriorityQueue<>(Collections.reverseOrder());
        this.large = new PriorityQueue<>();
        this.hashTable = new HashMap<>();
    }
    
    public double[] medianSlidingWindow(int[] nums, int k) {
        double[] result = new double[nums.length - k + 1];
        
        // Initialize first window
        for (int i = 0; i < k; i++) {
            addNum(nums[i]);
        }
        
        result[0] = getMedian();
        
        // Slide the window
        for (int i = k; i < nums.length; i++) {
            // Remove the leftmost element
            removeNum(nums[i - k]);
            // Add the new element
            addNum(nums[i]);
            result[i - k + 1] = getMedian();
        }
        
        return result;
    }
    
    private void addNum(int num) {
        if (small.isEmpty() || num <= small.peek()) {
            small.offer(num);
        } else {
            large.offer(num);
        }
        balance();
    }
    
    private void removeNum(int num) {
        hashTable.put(num, hashTable.getOrDefault(num, 0) + 1);
        if (num <= small.peek()) {
            balanceAfterRemoval(small, -1);
        } else {
            balanceAfterRemoval(large, 1);
        }
        balance();
    }
    
    private void balanceAfterRemoval(PriorityQueue<Integer> heap, int sign) {
        while (!heap.isEmpty() && hashTable.getOrDefault(heap.peek(), 0) > 0) {
            hashTable.put(heap.peek(), hashTable.get(heap.peek()) - 1);
            heap.poll();
        }
    }
    
    private void balance() {
        // Balance the heaps
        if (small.size() > large.size() + 1) {
            large.offer(small.poll());
        } else if (large.size() > small.size() + 1) {
            small.offer(large.poll());
        }
        
        // Remove invalid elements
        balanceAfterRemoval(small, -1);
        balanceAfterRemoval(large, 1);
    }
    
    private double getMedian() {
        if (small.size() == large.size()) {
            return ((long) small.peek() + large.peek()) / 2.0;
        } else if (small.size() > large.size()) {
            return (double) small.peek();
        } else {
            return (double) large.peek();
        }
    }
}

// Example: Maximum sum of 3 non-overlapping subarrays
public int[] maxSumOfThreeSubarrays(int[] nums, int k) {
    int n = nums.length;
    
    // Calculate sum of each subarray of length k
    int[] sums = new int[n - k + 1];
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    sums[0] = windowSum;
    
    for (int i = k; i < n; i++) {
        windowSum += nums[i] - nums[i - k];
        sums[i - k + 1] = windowSum;
    }
    
    // Left array: best subarray ending at or before index i
    int[] left = new int[sums.length];
    int best = 0;
    for (int i = 0; i < sums.length; i++) {
        if (sums[i] > sums[best]) {
            best = i;
        }
        left[i] = best;
    }
    
    // Right array: best subarray starting at or after index i
    int[] right = new int[sums.length];
    best = sums.length - 1;
    for (int i = sums.length - 1; i >= 0; i--) {
        if (sums[i] >= sums[best]) {
            best = i;
        }
        right[i] = best;
    }
    
    // Find the maximum sum by trying each middle subarray
    int maxSum = 0;
    int[] result = new int[3];
    
    for (int mid = k; mid < sums.length - k; mid++) {
        int l = left[mid - k];
        int r = right[mid + k];
        int total = sums[l] + sums[mid] + sums[r];
        if (total > maxSum) {
            maxSum = total;
            result = new int[]{l, mid, r};
        }
    }
    
    return result;
}`,
    visualization: "Sliding Window Maximum/Minimum",
  },
];

// Tips and common mistakes
const tips = [
  "Identify if the problem requires fixed or variable window size",
  "Use two pointers technique for variable size windows",
  "Maintain window state efficiently - avoid recalculating from scratch",
  "Consider using hash maps for frequency-based sliding windows",
  "For string problems, focus on character frequency and constraints",
  "Use deque for sliding window maximum/minimum problems",
  "Binary search on answer combined with sliding window for optimization",
  "Test edge cases: empty arrays, single elements, window size larger than array",
];

const mistakes = [
  "Not updating window boundaries correctly when sliding",
  "Forgetting to handle edge cases like k > array length",
  "Recalculating window sum instead of using sliding calculation",
  "Not maintaining proper window size in variable window problems",
  "Incorrectly handling frequency maps in character-based problems",
  "Missing boundary checks when expanding or contracting windows",
  "Not considering all constraints when validating window conditions",
  "Inefficient data structure choices for window maintenance",
];

const strategies = [
  "Start by identifying the window type (fixed vs variable)",
  "Draw out examples to visualize window movement",
  "Implement brute force first, then optimize with sliding window",
  "Use appropriate data structures (hash map, deque, heap) based on requirements",
  "Practice with different constraint types to build pattern recognition",
  "Focus on optimal time complexity - most sliding window problems are O(n)",
  "Understand when to expand vs contract the window",
  "Master the template patterns for each sliding window type",
];

// DOM elements
let elements = {};

// Initialize application
document.addEventListener("DOMContentLoaded", function () {
  initializeElements();
  setupEventListeners();
  loadPatterns();
  renderSidebar();
  renderTips();
  setupTheme();
});

function initializeElements() {
  elements = {
    sidebar: document.getElementById("sidebar"),
    sidebarNav: document.getElementById("sidebar-nav"),
    menuToggle: document.getElementById("menu-toggle"),
    sidebarToggle: document.getElementById("sidebar-toggle"),
    mobileOverlay: document.getElementById("mobile-overlay"),
    mainContainer: document.querySelector(".main-container"),
    searchInput: document.getElementById("search-input"),
    difficultyFilter: document.getElementById("difficulty-filter"),
    themeToggle: document.getElementById("theme-toggle"),
    generatePdfBtn: document.getElementById("generate-pdf-btn"),
    progressIndicator: document.getElementById("progress-indicator"),
    patternsGrid: document.getElementById("patterns-grid"),
    tipsToggle: document.getElementById("tips-toggle"),
    tipsContent: document.getElementById("tips-content"),
    tipsList: document.getElementById("tips-list"),
    mistakesList: document.getElementById("mistakes-list"),
    strategyList: document.getElementById("strategy-list"),
  };
}

function setupEventListeners() {
  // Sidebar toggle
  elements.menuToggle?.addEventListener("click", toggleSidebar);
  elements.sidebarToggle?.addEventListener("click", toggleSidebar);
  elements.mobileOverlay?.addEventListener("click", closeSidebar);

  // Search with debounce
  elements.searchInput?.addEventListener("input", debounceSearch);

  // Difficulty filter
  elements.difficultyFilter?.addEventListener("change", applyFilters);

  // Theme toggle
  elements.themeToggle?.addEventListener("click", toggleTheme);

  // PDF generation
  elements.generatePdfBtn?.addEventListener("click", generatePDF);

  // Tips toggle
  elements.tipsToggle?.addEventListener("click", toggleTips);

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);

  // Resize handler
  window.addEventListener("resize", handleResize);
}

function loadPatterns() {
  patternsData = slidingWindowPatterns;
  filteredPatterns = [...patternsData];
  renderPatterns();
}

function renderSidebar() {
  if (!elements.sidebarNav) return;

  const navItems = patternsData
    .map(
      (pattern) => `
        <a href="#pattern-${pattern.id}" class="nav-item" data-pattern-id="${pattern.id}">
            ${pattern.name}
        </a>
    `
    )
    .join("");

  elements.sidebarNav.innerHTML = navItems;

  // Add click listeners for smooth scrolling
  elements.sidebarNav.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const patternId = item.dataset.patternId;
      scrollToPattern(patternId);
      updateActiveNavItem(patternId);
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });
}

function renderPatterns() {
  if (!elements.patternsGrid) return;

  const patternsHTML = filteredPatterns
    .map(
      (pattern) => `
        <div class="pattern-card" id="pattern-${pattern.id}" data-pattern-id="${
        pattern.id
      }">
            <div class="pattern-header" onclick="togglePattern(${pattern.id})">
                <h3 class="pattern-title">${pattern.name}</h3>
                <button class="pattern-toggle">+</button>
            </div>
            
            <p class="pattern-description">${pattern.description}</p>
            
            <div class="complexity-badges">
                <span class="complexity-badge">Time: ${
                  pattern.time_complexity
                }</span>
                <span class="complexity-badge">Space: ${
                  pattern.space_complexity
                }</span>
            </div>
            
            <div class="pattern-details">
                <div class="pattern-sections">
                    <div class="use-cases-section">
                        <h4 class="section-header">Use Cases</h4>
                        <ul class="use-cases-list">
                            ${pattern.use_cases
                              .map((useCase) => `<li>${useCase}</li>`)
                              .join("")}
                        </ul>
                    </div>
                    
                    <div class="problems-section">
                        <h4 class="section-header">LeetCode Problems</h4>
                        <div class="problems-list">
                            ${pattern.leetcode_problems
                              .map(
                                (problem) => `
                                <div class="problem-item" data-difficulty="${problem.difficulty}">
                                    <div class="problem-title">
                                        ${problem.title}
                                        <span class="problem-difficulty ${problem.difficulty}">${problem.difficulty}</span>
                                    </div>
                                    <div class="problem-leetcode">LeetCode #${problem.id}</div>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
                
                <div class="code-viz-section">
                    <div class="code-section">
                        <h4 class="section-header">Java Code Template</h4>
                        <div class="code-block">
                            <pre><code class="language-java">${
                              pattern.code_template
                            }</code></pre>
                        </div>
                    </div>
                    
                    <div class="visualization-section">
                        <h4 class="section-header">Visualization</h4>
                        <img src="${
                          visualImages[pattern.visualization] ||
                          visualImages["Fixed Size Sliding Window"]
                        }" 
                             alt="${pattern.name} visualization" 
                             class="visualization-image"
                             loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  elements.patternsGrid.innerHTML = patternsHTML;

  // Apply difficulty filter if set
  applyDifficultyFilter();

  // Highlight syntax after rendering
  if (window.Prism) {
    setTimeout(() => {
      Prism.highlightAll();
    }, 100);
  }
}

function renderTips() {
  if (elements.tipsList) {
    elements.tipsList.innerHTML = tips.map((tip) => `<li>${tip}</li>`).join("");
  }

  if (elements.mistakesList) {
    elements.mistakesList.innerHTML = mistakes
      .map((mistake) => `<li>${mistake}</li>`)
      .join("");
  }

  if (elements.strategyList) {
    elements.strategyList.innerHTML = strategies
      .map((strategy) => `<li>${strategy}</li>`)
      .join("");
  }
}

function toggleSidebar() {
  elements.sidebar?.classList.toggle("open");
  elements.mainContainer?.classList.toggle("sidebar-open");
  elements.mobileOverlay?.classList.toggle("active");
}

function closeSidebar() {
  elements.sidebar?.classList.remove("open");
  elements.mainContainer?.classList.remove("sidebar-open");
  elements.mobileOverlay?.classList.remove("active");
}

function togglePattern(patternId) {
  const patternCard = document.getElementById(`pattern-${patternId}`);
  if (patternCard) {
    patternCard.classList.toggle("expanded");

    // Re-highlight syntax when expanding
    if (patternCard.classList.contains("expanded") && window.Prism) {
      setTimeout(() => {
        Prism.highlightAllUnder(patternCard);
      }, 100);
    }
  }
}

function toggleTips() {
  const isHidden = elements.tipsContent?.classList.contains("hidden");

  if (isHidden) {
    elements.tipsContent?.classList.remove("hidden");
    if (elements.tipsToggle) elements.tipsToggle.textContent = "Hide Tips";
  } else {
    elements.tipsContent?.classList.add("hidden");
    if (elements.tipsToggle) elements.tipsToggle.textContent = "Show Tips";
  }
}

function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(performSearch, 300);
}

function performSearch() {
  const query = elements.searchInput?.value.toLowerCase().trim() || "";

  // Clear previous highlights first
  clearHighlights();

  if (query === "") {
    filteredPatterns = [...patternsData];
  } else {
    filteredPatterns = patternsData.filter((pattern) => {
      return (
        pattern.name.toLowerCase().includes(query) ||
        pattern.description.toLowerCase().includes(query) ||
        pattern.use_cases.some((useCase) =>
          useCase.toLowerCase().includes(query)
        ) ||
        pattern.leetcode_problems.some((problem) =>
          problem.title.toLowerCase().includes(query)
        )
      );
    });
  }

  renderPatterns();

  // Apply highlights after rendering
  if (query) {
    setTimeout(() => highlightSearchResults(query), 100);
  }
}

function applyFilters() {
  performSearch(); // This will handle both search and difficulty filtering
}

function applyDifficultyFilter() {
  const selectedDifficulty = elements.difficultyFilter?.value;

  if (selectedDifficulty && selectedDifficulty !== "all") {
    const problemItems = document.querySelectorAll(".problem-item");
    problemItems.forEach((item) => {
      const difficulty = item.dataset.difficulty;
      if (difficulty === selectedDifficulty) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  } else {
    const problemItems = document.querySelectorAll(".problem-item");
    problemItems.forEach((item) => {
      item.style.display = "block";
    });
  }
}

function clearHighlights() {
  document.querySelectorAll(".highlight").forEach((el) => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
    parent.normalize();
  });
}

function highlightSearchResults(query) {
  if (!query) return;

  const patterns = document.querySelectorAll(".pattern-card");
  patterns.forEach((pattern) => {
    highlightTextInElement(pattern, query);
  });
}

function highlightTextInElement(element, query) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      if (node.parentElement.tagName === "CODE")
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.toLowerCase().includes(query)) {
      textNodes.push(node);
    }
  }

  textNodes.forEach((textNode) => {
    const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
    const text = textNode.textContent;

    if (regex.test(text)) {
      const span = document.createElement("span");
      span.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
      textNode.parentNode.replaceChild(span, textNode);
    }
  });
}

function scrollToPattern(patternId) {
  const element = document.getElementById(`pattern-${patternId}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateActiveNavItem(patternId) {
  elements.sidebarNav?.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  const activeItem = elements.sidebarNav?.querySelector(
    `[data-pattern-id="${patternId}"]`
  );
  if (activeItem) {
    activeItem.classList.add("active");
  }
}

function setupTheme() {
  // Initialize theme based on user preference or system preference
  const savedTheme = localStorage.getItem("theme") || "auto";
  currentTheme = savedTheme;
  applyTheme(currentTheme);
}

function toggleTheme() {
  const themes = ["auto", "light", "dark"];
  const currentIndex = themes.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  currentTheme = themes[nextIndex];

  localStorage.setItem("theme", currentTheme);
  applyTheme(currentTheme);
}

function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "auto") {
    root.removeAttribute("data-color-scheme");
  } else {
    root.setAttribute("data-color-scheme", theme);
  }

  // Update theme toggle button text
  const themeIcons = { auto: "🌓", light: "☀️", dark: "🌙" };
  if (elements.themeToggle) {
    elements.themeToggle.textContent = themeIcons[theme];
  }
}

function handleKeyboardShortcuts(e) {
  if (e.ctrlKey && e.key === "f") {
    e.preventDefault();
    if (elements.searchInput) {
      elements.searchInput.focus();
    }
  }

  if (e.key === "Escape") {
    if (elements.searchInput) {
      elements.searchInput.value = "";
      performSearch();
    }
  }

  if (e.ctrlKey && e.key === "m") {
    e.preventDefault();
    toggleSidebar();
  }
}

function handleResize() {
  if (window.innerWidth > 1024) {
    closeSidebar();
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// PDF generation functionality
async function generatePDF() {
  if (!window.jspdf) {
    alert("PDF generation library not loaded");
    return;
  }

  try {
    showProgress();

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let currentY = margin;

    // Title page
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("Sliding Window Patterns Guide", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 15;
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text("Java Implementation Reference", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 20;
    pdf.setFontSize(14);
    pdf.text(
      "Complete guide with 10 patterns and LeetCode problems",
      pageWidth / 2,
      currentY,
      { align: "center" }
    );

    currentY += 10;
    pdf.setFontSize(12);
    pdf.text(
      "Generated on: " + new Date().toLocaleDateString(),
      pageWidth / 2,
      currentY,
      { align: "center" }
    );

    // Add patterns content
    for (let i = 0; i < patternsData.length; i++) {
      const pattern = patternsData[i];

      pdf.addPage();
      currentY = margin;

      // Pattern title
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${i + 1}. ${pattern.name}`, margin, currentY);
      currentY += 12;

      // Description
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const descLines = pdf.splitTextToSize(pattern.description, contentWidth);
      pdf.text(descLines, margin, currentY);
      currentY += descLines.length * 6 + 8;

      // Complexity
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Time Complexity: ${pattern.time_complexity}`, margin, currentY);
      currentY += 6;
      pdf.text(
        `Space Complexity: ${pattern.space_complexity}`,
        margin,
        currentY
      );
      currentY += 10;

      // Use cases
      pdf.setFont("helvetica", "bold");
      pdf.text("Use Cases:", margin, currentY);
      currentY += 6;

      pdf.setFont("helvetica", "normal");
      pattern.use_cases.forEach((useCase) => {
        const lines = pdf.splitTextToSize(`• ${useCase}`, contentWidth - 10);
        pdf.text(lines, margin + 5, currentY);
        currentY += lines.length * 5;
      });
      currentY += 5;

      // LeetCode problems
      pdf.setFont("helvetica", "bold");
      pdf.text("LeetCode Problems:", margin, currentY);
      currentY += 6;

      pattern.leetcode_problems.forEach((problem) => {
        pdf.setFont("helvetica", "normal");
        pdf.text(
          `• ${problem.title} (#${problem.id}) - ${problem.difficulty}`,
          margin + 5,
          currentY
        );
        currentY += 5;
      });
    }

    // Add tips section
    pdf.addPage();
    currentY = margin;

    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("Tips & Strategies", margin, currentY);
    currentY += 15;

    // Tips
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("💡 Tips", margin, currentY);
    currentY += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    tips.forEach((tip) => {
      const lines = pdf.splitTextToSize(`• ${tip}`, contentWidth);
      pdf.text(lines, margin, currentY);
      currentY += lines.length * 4 + 2;
    });

    currentY += 8;

    // Common mistakes
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("⚠️ Common Mistakes", margin, currentY);
    currentY += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    mistakes.forEach((mistake) => {
      const lines = pdf.splitTextToSize(`• ${mistake}`, contentWidth);
      pdf.text(lines, margin, currentY);
      currentY += lines.length * 4 + 2;
    });

    // Save the PDF
    pdf.save("sliding-window-patterns-java-guide.pdf");

    setTimeout(() => {
      hideProgress();
    }, 500);
  } catch (error) {
    console.error("Error generating PDF:", error);
    hideProgress();
    alert("Error generating PDF. Please try again.");
  }
}

function showProgress() {
  if (elements.generatePdfBtn) {
    elements.generatePdfBtn.classList.add("loading");
    elements.generatePdfBtn.disabled = true;
    elements.generatePdfBtn.textContent = "Generating...";
  }
  if (elements.progressIndicator) {
    elements.progressIndicator.classList.remove("hidden");
  }
}

function hideProgress() {
  if (elements.generatePdfBtn) {
    elements.generatePdfBtn.classList.remove("loading");
    elements.generatePdfBtn.disabled = false;
    elements.generatePdfBtn.textContent = "Generate PDF";
  }
  if (elements.progressIndicator) {
    elements.progressIndicator.classList.add("hidden");
  }
}

// Make functions globally available
window.togglePattern = togglePattern;
