const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function createAlternatingCapsString(alphabets) {
  let allChars = "";
  alphabets.forEach((item) => {
    for (let char of item) {
      if (/^[A-Za-z]$/.test(char)) {
        allChars += char.toLowerCase();
      }
    }
  });

  let reversed = allChars.split("").reverse().join("");

  let result = "";
  for (let i = 0; i < reversed.length; i++) {
    if (i % 2 === 0) {
      result += reversed[i].toLowerCase();
    } else {
      result += reversed[i].toUpperCase();
    }
  }

  return result;
}

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid input: 'data' should be an array",
      });
    }

    const oddNumbers = [];
    const evenNumbers = [];
    const alphabets = [];
    const specialCharacters = [];
    let sum = 0;

    data.forEach((item) => {
      const str = String(item);

      if (/^\d+$/.test(str)) {
        const num = parseInt(str);
        sum += num;

        if (num % 2 === 0) {
          evenNumbers.push(str);
        } else {
          oddNumbers.push(str);
        }
      } else if (/^[A-Za-z]+$/.test(str)) {
        alphabets.push(str.toUpperCase());
      } else if (str.length === 1 && !/^[A-Za-z0-9]$/.test(str)) {
        specialCharacters.push(str);
      } else {
        for (let char of str) {
          if (/^[0-9]$/.test(char)) {
            const num = parseInt(char);
            sum += num;

            if (num % 2 === 0) {
              if (!evenNumbers.includes(char)) {
                evenNumbers.push(char);
              }
            } else {
              if (!oddNumbers.includes(char)) {
                oddNumbers.push(char);
              }
            }
          } else if (/^[A-Za-z]$/.test(char)) {
            const upperChar = char.toUpperCase();
            if (!alphabets.includes(upperChar)) {
              alphabets.push(upperChar);
            }
          } else {
            if (!specialCharacters.includes(char)) {
              specialCharacters.push(char);
            }
          }
        }
      }
    });

    const concatString = createAlternatingCapsString(alphabets);

    const response = {
      is_success: true,
      user_id: "souparnika_jayagopal_26032004",
      email: "souparnikajs2004@gmail.com",
      roll_number: "22BBS0089",
      odd_numbers: oddNumbers,
      even_numbers: evenNumbers,
      alphabets: alphabets,
      special_characters: specialCharacters,
      sum: sum.toString(),
      concat_string: concatString,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      is_success: false,
      error: "Internal server error",
    });
  }
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "API is running",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
