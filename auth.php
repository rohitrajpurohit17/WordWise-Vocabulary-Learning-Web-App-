<?php
session_start();

$usersFile = "users.json";
if (!file_exists($usersFile)) file_put_contents($usersFile, json_encode([]));

$users = json_decode(file_get_contents($usersFile), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $action = $_POST['action'];

    if ($action === 'register') {
        if (!isset($users[$username])) {
            $users[$username] = password_hash($password, PASSWORD_DEFAULT);
            file_put_contents($usersFile, json_encode($users));
            $_SESSION['user'] = $username;
            header("Location: home.php");
            exit;
        } else {
            $error = "Username already exists.";
        }
    } elseif ($action === 'login') {
        if (isset($users[$username]) && password_verify($password, $users[$username])) {
            $_SESSION['user'] = $username;
            header("Location: home.php");
            exit;
        } else {
            $error = "Invalid credentials.";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
  <title>Login/Register - WordWise</title>
</head>
<body>
  <div class="container" style="max-width: 400px; margin-top: 100px;">
    <h2 style="text-align: center;">WordWise Access</h2>
    <?php if (!empty($error)): ?>
      <p style="color: red; text-align: center;"><?= $error ?></p>
    <?php endif; ?>
    <form method="POST">
      <input type="text" name="username" placeholder="Username" required style="width: 100%; margin-bottom: 10px; padding: 10px;">
      <input type="password" name="password" placeholder="Password" required style="width: 100%; margin-bottom: 10px; padding: 10px;">
      <button type="submit" name="action" value="login" class="play-btn">Login</button>
      <button type="submit" name="action" value="register" class="play-btn" style="margin-top: 10px;">Register</button>
    </form>
  </div>
</body>
</html>
