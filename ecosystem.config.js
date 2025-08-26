// ecosystem.config.js
module.exports = {
    apps: [
        {
            name: 'api-gateway',
            script: 'dist/apps/api-gateway/main.js',
            instances: 1,
            exec_mode: 'cluster',
            env_production: {
                NODE_ENV: 'production',
            },
            max_memory_restart: '300M',
            restart_delay: 2000,
            merge_logs: true,
            error_file: './logs/api-gateway-error.log',
            out_file: './logs/api-gateway-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
        },
        {
            name: 'auth',
            script: 'dist/apps/auth/main.js',
            instances: 1,
            exec_mode: 'cluster',
            env_production: {
                NODE_ENV: 'production',
            },
            max_memory_restart: '300M',
            restart_delay: 3000,
            merge_logs: true,
            error_file: './logs/auth-error.log',
            out_file: './logs/auth-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
        },
        {
            name: 'user',
            script: 'dist/apps/user/main.js',
            instances: 1,
            exec_mode: 'cluster',
            env_production: {
                NODE_ENV: 'production',
            },
            max_memory_restart: '300M',
            restart_delay: 3001,
            merge_logs: true,
            error_file: './logs/user-error.log',
            out_file: './logs/user-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
        },
        {
            name: 'upload',
            script: 'dist/apps/upload/main.js',
            instances: 1,
            exec_mode: 'cluster',
            env_production: {
                NODE_ENV: 'production',
            },
            max_memory_restart: '300M',
            restart_delay: 3002,
            merge_logs: true,
            error_file: './logs/upload-error.log',
            out_file: './logs/upload-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
        }

    ],
};
